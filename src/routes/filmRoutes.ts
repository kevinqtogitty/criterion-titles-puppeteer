import { Router } from 'express';
import { tryCatch } from '../utils/tryCatch';
import { getAllFilms } from '../controllers/filmControllers';

const filmRouter = Router();

filmRouter.get('/', tryCatch(getAllFilms));

export default filmRouter;
