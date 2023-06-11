import express, { ErrorRequestHandler, Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import cors from 'cors';
import { createClient } from 'redis';
import filmRouter from './routes/filmRoutes';
import dotenv from 'dotenv';
import { updateFilms } from './controllers/filmControllers';
import { firebaseConfig } from './firebase/firebaseInit';

dotenv.config();

/* Express Init */
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('hello');
});

app.use('/films', filmRouter);

app.listen(PORT, (): void => {
  console.log(`Server Running on port ${PORT}`);
});

/* Firebase Init */
const firebaseApp = initializeApp(firebaseConfig);
export const fireStoreDB = getFirestore(firebaseApp);

/* Redis Init */
export const client = createClient({
  url: process.env.REDIS_URL
});
export const expiration = 86400;

client.connect().then(() => {
  console.log('redis connected');
});

client.on('error', (err: ErrorRequestHandler) => {
  console.log('Error ' + err);
});

setInterval(updateFilms, 1000 * 60 * 60 * 24);
