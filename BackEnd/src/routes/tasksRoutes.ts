import { Router } from 'express';
import tasksController from '../controllers/tasksController';

import { authMiddleware } from '../middlewares/tokenMiddleware';

const route = Router();

route.get('/', authMiddleware, tasksController.getTasks);
route.post('/', authMiddleware, tasksController.addTasks);
route.delete('/:id', authMiddleware, tasksController.deleteTask);
route.put('/', authMiddleware, tasksController.editTask);

export default route;
