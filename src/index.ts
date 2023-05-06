import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase/firebaseInit';
import { createClient } from 'redis';
import filmRouter from './routes/filmRoutes';
import dotenv from 'dotenv';
dotenv.config();

export const client = createClient({
  url: 'redis://127.0.0.1:6379',
  legacyMode: true
});

export const expiration = 3600;
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

client.connect().then(() => {
  console.log('redis connected');
});

client.on('error', (err) => {
  console.log('Error ' + err);
});

const firebaseClient = initializeApp(firebaseConfig);
// console.log(firebaseClient);

// extractFilmInfo();
