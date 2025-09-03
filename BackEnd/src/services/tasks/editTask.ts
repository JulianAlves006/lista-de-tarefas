import { db } from '../../database/model';
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

class TaskEditer {
  async editTask(body: Task, id_user: string) {
    const { id, description, priority, responsable, status } = body;
    const computerName = os.hostname();
    if (!id || !id_user) throw new Error('O id da tarefa e do usuário é obrigatório para a edição da tarefa');
    const newTask: Task = {
      id,
      description,
      priority,
      responsable,
      status,
      computerName,
      id_user,
    };
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
      const taskData = taskDoc.data();

      if(taskData.id_user !== id_user) throw new Error('Este usuário não pode realizar está ação!');
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

  }
}

export default new TaskEditer();
