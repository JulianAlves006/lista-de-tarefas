import { db } from '../../database/model';
import os from 'os';

interface Task {
  id: String;
  description: String;
  priority: String;
  responsable: String;
  status: String;
  computerName: String;
}

class TaskEditer {
  async editTask(body: Task) {
    const { id, description, priority, responsable, status } = body;
    const computerName = os.hostname();
    if (!id) throw new Error('O id é obrigatório para a edição da tarefa');
    const newTask: Task = {
      id,
      description,
      priority,
      responsable,
      status,
      computerName,
    };
    try {
      const snapshot = await db
        .collection('tasks')
        .where('id', '==', id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Task não encontrada');
      }

      // Editar o documento encontrado
      const taskDoc = snapshot.docs[0];
      await taskDoc.ref.update({
        description: newTask.description,
        priority: newTask.priority,
        responsable: newTask.responsable,
        status: newTask.status,
        computerName: newTask.computerName,
      });

      return {
        message: 'Task editada com sucesso',
        id: id,
      };
    } catch (error) {
      return error;
    }
  }
}

export default new TaskEditer();
