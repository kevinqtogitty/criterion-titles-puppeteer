"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiration = exports.client = exports.fireStoreDB = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const filmRoutes_1 = __importDefault(require("./routes/filmRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const filmControllers_1 = require("./controllers/filmControllers");
const firebaseInit_1 = require("./firebase/firebaseInit");
const node_cron_1 = __importDefault(require("node-cron"));
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
/* Firebase Init */
const firebaseApp = (0, app_1.initializeApp)(firebaseInit_1.firebaseConfig);
exports.fireStoreDB = (0, firestore_1.getFirestore)(firebaseApp);
/* Redis Init */
exports.client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
exports.expiration = 86400;
exports.client.connect().then(() => {
    console.log('redis connected');
});
exports.client.on('error', (err) => {
    console.log('Error ' + err);
});
/* Scheduled Tasks */
node_cron_1.default.schedule('0 0 0 * * *', () => (0, filmControllers_1.updateFilms)());
