"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFilms = exports.getAllFilms = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const __1 = require("..");
const firestore_1 = require("firebase/firestore");
const getAllFilms = async (req, res) => {
    try {
        const cachedFilms = await __1.client.get('allCriterionFilms');
        if (!cachedFilms) {
            console.log('cache missed');
            const docRef = (0, firestore_1.doc)(__1.fireStoreDB, 'films', 'KDJRdL9D062pgQgXgivM');
            const docSnap = await (0, firestore_1.getDoc)(docRef);
            if (docSnap.exists()) {
                await __1.client.setEx('allCriterionFilms', __1.expiration, JSON.stringify(docSnap.data()));
            }
            else {
                console.log('No such document!');
            }
            res.status(200).json(docSnap.data());
        }
        else {
            console.log('cache hit');
            res.status(200).json(JSON.parse(cachedFilms));
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.getAllFilms = getAllFilms;
const updateFilms = async () => {
    console.log('Updating cache data');
    try {
        const browser = await puppeteer_1.default.launch({ headless: 'new' });
        const filmInfo = await scrapeFilmData(browser);
        if (await __1.client.get('allCriterionFilms')) {
            await __1.client.flushAll();
            await __1.client.setEx('allCriterionFilms', __1.expiration, JSON.stringify(filmInfo));
        }
        await browser.close();
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(__1.fireStoreDB, 'films', 'KDJRdL9D062pgQgXgivM'), {
            allfilms: filmInfo
        });
    }
    catch (e) {
        console.log(e);
    }
};
exports.updateFilms = updateFilms;
const scrapeFilmData = async (browser) => {
    console.log('scraping has begun');
    const page = await browser.newPage();
    await page.goto('https://films.criterionchannel.com/', {
        timeout: 0
    });
    await page.waitForSelector('.criterion-channel__tr');
    // Extract film information
    const filmInfo = await page.evaluate(() => {
        const filmRows = Array.from(document.querySelectorAll('.criterion-channel__tr'));
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
