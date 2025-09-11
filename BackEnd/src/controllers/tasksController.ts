import TaskServices from '../services/tasks/getTasks';
import TaskCreater from '../services/tasks/createTasks';
import TaskDeleter from '../services/tasks/deleteTask';
import TaskEditer from '../services/tasks/editTask';

class TasksController {
  async getTasks(req: any, res: any) {
    if(!req.user.id) return res.status(401).json('Você precisa logar');
    const response = await TaskServices.getAllTasks(req.user.id_fire);
    res.json(response);
  }

  async addTasks(req: any, res: any) {
    if(!req.user.id) return res.status(401).json('Você precisa logar');
    const response = await TaskCreater.createTask(req.body, req.user.id);
    res.json(response)
  }

  async deleteTask(req: any, res: any) {
    try {
      if(!req.user.id) return res.status(401).json('Você precisa logar');
      const response = await TaskDeleter.deleteTask(req.params.id, req.user.id);
      res.json(response);
    } catch (error: any) {
      res.status(400).json(error?.message);
    }
  }

  async editTask(req: any, res: any) {
    try {
      if(!req.user.id) return res.status(401).json('Você precisa logar');
      const response = await TaskEditer.editTask(req.body, req.user.id);
      res.json(response);
    } catch (error: any) {
      res.status(400).json(error?.message);
    }
  }
}

export default new TasksController();
