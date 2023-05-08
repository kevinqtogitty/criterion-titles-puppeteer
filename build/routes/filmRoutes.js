"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tryCatch_1 = require("../utils/tryCatch");
const filmControllers_1 = require("../controllers/filmControllers");
const filmRouter = (0, express_1.Router)();
filmRouter.get('/', (0, tryCatch_1.tryCatch)(filmControllers_1.getAllFilms));
exports.default = filmRouter;
