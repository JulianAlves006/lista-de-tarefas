import { Router } from 'express';
import usersController from '../controllers/usersController';

const route = Router();

route.post('/', usersController.createUser);
route.put('/', usersController.updateUser);

export default route;
