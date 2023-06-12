import puppeteer, { Browser } from 'puppeteer';
import { Response, Request } from 'express';
import { client, expiration, fireStoreDB } from '..';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const getAllFilms = async (req: Request, res: Response) => {
  try {
    const cachedFilms = await client.get('allCriterionFilms');

    if (!cachedFilms) {
      console.log('cache missed');

      const docRef = doc(fireStoreDB, 'films', 'KDJRdL9D062pgQgXgivM');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await client.setEx(
          'allCriterionFilms',
          expiration,
          JSON.stringify(docSnap.data())
        );
      } else {
        console.log('No such document!');
      }

      res.status(200).json(docSnap.data());
    } else {
      console.log('cache hit');
      res.status(200).json(JSON.parse(cachedFilms));
    }
  } catch (e) {
    console.log(e);
  }
};

const updateFilms = async () => {
  console.log('Updating cache data');
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const filmInfo = await scrapeFilmData(browser);

    if (await client.get('allCriterionFilms')) {
      await client.flushAll();

      await client.setEx(
        'allCriterionFilms',
        expiration,
        JSON.stringify(filmInfo)
      );
    }

    await browser.close();
    await setDoc(doc(fireStoreDB, 'films', 'KDJRdL9D062pgQgXgivM'), {
      allfilms: filmInfo
    });
  } catch (e) {
    console.log(e);
  }
};

const scrapeFilmData = async (browser: Browser) => {
  console.log('scraping has begun');

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

  return filmInfo;
};

export { getAllFilms, updateFilms };
