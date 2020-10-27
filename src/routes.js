import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RelationController from './app/controllers/RelationController';
import EssayFileController from './app/controllers/EssayFileController';
import EssayController from './app/controllers/EssayController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/relations', RelationController.store);
routes.get('/relations', RelationController.index);
routes.delete('/relations/:relationId', RelationController.delete);

routes.post('/essayfiles', upload.single('file'), EssayFileController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/essays', EssayController.store);
routes.put('/essays/:essayId', EssayController.update);
routes.get('/essays', EssayController.index);
routes.get('/essays/:essayId', EssayController.show);
routes.delete('/essays/:essayId', EssayController.delete);

export default routes;
