import express from 'express';
import cors from 'cors';

import tasksRoute from './routes/tasksRoutes';
import userRoute from './routes/usersRoutes';
import loginRoute from './routes/loginRoutes';
import './database/model';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  routes() {
    this.app.use('/tasks', tasksRoute);
    this.app.use('/users', userRoute);
    this.app.use('/login', loginRoute);
  }
}

export default new App().app;
