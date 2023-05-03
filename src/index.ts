import express, { Request, Response, json } from 'express';
import puppeteer from 'puppeteer';
import Fs from 'fs/promises';
import data from './data.json';

const extractFilmInfo = async () => {
  const browser = await puppeteer.launch({ headless: false });
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
        ?.getAttribute('href')
    }));
    return data;
  });

  console.log(filmInfo);

  await browser.close();
};

console.log(data);

// extractFilmInfo();
