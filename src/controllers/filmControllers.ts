import puppeteer from 'puppeteer';
import { Response, Request } from 'express';
import { client, expiration } from '..';

const getAllFilms = async (req: Request, res: Response) => {
  console.log('Puppeteering');
  try {
    const cachedFilms = await client.get('allCriterionFilms');
    if (!cachedFilms) {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.goto('https://films.criterionchannel.com/', {
        timeout: 0
      });
      await page.waitForSelector('.criterion-channel__tr');

      // Extract film information
      const filmInfo = await page.evaluate(() => {
        const filmRows = Array.from(
          document.querySelectorAll('.criterion-channel__tr')
        );
        const data = filmRows.map((film) => ({
          title: film
            .querySelector('.criterion-channel__td--title a')
            ?.textContent?.replace(/(\r\n|\n|\r|\t)/gm, ''),
          director: film
            .querySelector('.criterion-channel__td--director')
            ?.textContent?.replace(/(\r\n|\n|\r|\t)/gm, ''),
          country: film
            .querySelector('.criterion-channel__td--country span')
            ?.textContent?.replace(/(\r\n|\n|\r|\t)/gm, ''),
          year: film
            .querySelector('.criterion-channel__td--year')
            ?.textContent?.replace(/(\r\n|\n|\r|\t)/gm, ''),
          link: film
            .querySelector('.criterion-channel__td--title a')
            ?.getAttribute('href'),
          imgUrl: film
            .querySelector('.criterion-channel__film-img')
            ?.getAttribute('src')
        }));
        return data;
      });

      await client.setEx(
        'allCriterionFilms',
        expiration,
        JSON.stringify(filmInfo)
      );

      await browser.close();

      res.status(200).json(filmInfo);
    } else {
      console.log(cachedFilms);
      res.status(200).json(JSON.parse(cachedFilms));
    }
  } catch (e) {
    console.log(e);
  }
};

export { getAllFilms };
