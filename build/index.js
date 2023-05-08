"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiration = exports.client = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_1 = require("firebase/app");
const firebaseInit_1 = require("./firebase/firebaseInit");
const redis_1 = require("redis");
const filmRoutes_1 = __importDefault(require("./routes/filmRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* Express Init */
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.status(200).json('hello');
});
app.use('/films', filmRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
/* Redis Init */
exports.client = (0, redis_1.createClient)();
exports.expiration = 10000;
exports.client.connect().then(() => {
    console.log('redis connected');
});
exports.client.on('error', (err) => {
    console.log('Error ' + err);
});
/* Firebase Init */
const firebaseClient = (0, app_1.initializeApp)(firebaseInit_1.firebaseConfig);
