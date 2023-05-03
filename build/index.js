"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const data_json_1 = __importDefault(require("./data.json"));
const extractFilmInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: false });
    const page = yield browser.newPage();
    yield page.goto('https://films.criterionchannel.com/', {
        timeout: 0
    });
    yield page.waitForSelector('.criterion-channel__tr');
    // Extract film information
    const filmInfo = yield page.evaluate(() => {
        const filmRows = Array.from(document.querySelectorAll('.criterion-channel__tr'));
        const data = filmRows.map((film) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return ({
                title: (_b = (_a = film
                    .querySelector('.criterion-channel__td--title a')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/(\r\n|\n|\r|\t)/gm, ''),
                director: (_d = (_c = film
                    .querySelector('.criterion-channel__td--director')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.replace(/(\r\n|\n|\r|\t)/gm, ''),
                country: (_f = (_e = film
                    .querySelector('.criterion-channel__td--country span')) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.replace(/(\r\n|\n|\r|\t)/gm, ''),
                year: (_h = (_g = film
                    .querySelector('.criterion-channel__td--year')) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.replace(/(\r\n|\n|\r|\t)/gm, ''),
                link: (_j = film
                    .querySelector('.criterion-channel__td--title a')) === null || _j === void 0 ? void 0 : _j.getAttribute('href')
            });
        });
        return data;
    });
    console.log(filmInfo);
    yield browser.close();
});
console.log(data_json_1.default);
// extractFilmInfo();
