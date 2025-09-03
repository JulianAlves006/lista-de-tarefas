import { db } from '../../database/model';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

interface Task {
  id: String;
  description: String;
  priority: String;
  responsable: String;
  status: String;
  computerName: String;
  id_user: String;
}

class TaskCreater {
  async createTask(body: Task, id_user: string) {
    const { description, priority, responsable, status } = body;
    const computerName = os.hostname();
    const id = uuidv4();
    if (!description || !priority || !responsable || !status) {
      throw new Error('Todos os campos são obrigatórios!');
    }
    if(!id_user) throw new Error('Para criar novas tarefas, deve-se adicionar o ID do usuário!');
    const newTask: Task = {
      id,
      description,
      priority,
      responsable,
      status,
      computerName,
      id_user,
    };
    try {
      const docRef = await db.collection('tasks').add(newTask);

      // Retornar os dados da task criada com o ID do documento
      const { id, ...taskData } = newTask;
      return {
        id: docRef.id,
        ...taskData,
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

export default new TaskCreater();
