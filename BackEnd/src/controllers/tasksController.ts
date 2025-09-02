import TaskServices from '../services/tasks/getTasks';
import TaskCreater from '../services/tasks/createTasks';
import TaskDeleter from '../services/tasks/deleteTask';
import TaskEditer from '../services/tasks/editTask';

class TasksController {
  async getTasks(req: any, res: any) {
    const response = await TaskServices.getAllTasks();
    res.json(response);
  }

  async getTaskById(req: any, res: any) {
    const response = await TaskServices.getTaskById(req.params.id);
    res.json(response);
  }

  async addTasks(req: any, res: any) {
    const response = await TaskCreater.createTask(req.body);
    res.json(response);
  }

  async deleteTask(req: any, res: any) {
    const response = await TaskDeleter.deleteTask(req.params.id);
    res.json(response);
  }

  async editTask(req: any, res: any) {
    const response = await TaskEditer.editTask(req.body);
    res.json(response);
  }
}

export default new TasksController();
