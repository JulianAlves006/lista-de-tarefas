import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaWindowClose, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Form } from '../../style';
import api from '../../services/axios';
import { TaskContainer, Title, ModalOverlay, ModalContent, Task, CardsContainer } from './styled';
import { get } from 'lodash';
import Loading from '../../components/loading';

interface Task {
  id: string;
  description: string;
  priority: string;
  responsable: string;
  status: string;
  computerName: string;
}

export default function Tasks() {
  const [filter, setFilter] = useState('');
  const [modalDeleteIsOpen, setModaldeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState<string>('');
  const [responsable, setResponsable] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  function openModalDelete(id: string) {
    setSelectedTaskId(id);
    setModaldeleteIsOpen(true);
  }

  function closeModalDelete() {
    setModaldeleteIsOpen(false);
  }

  function openModalEdit(
    id: string,
    description: string,
    responsable: string,
    status: string,
    priority: string
  ) {
    setSelectedTaskId(id);
    setDescription(description);
    setResponsable(responsable);
    setStatus(status);
    setPriority(priority);

    setModalEditIsOpen(true);
  }

  function closeModalEdit() {
    setModalEditIsOpen(false);
  }

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      try {
        const response = await api.get(`/tasks`);
        setTasks(response.data);
      } catch (error) {
        const msg = get(error, 'response.data.error') || (error as Error)?.message || 'Erro inesperado';
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);

  async function handleDelete(e: any) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.delete(`/tasks/${selectedTaskId}`);
      toast.success('Tarefa deletada com sucesso');

      // Recarregar a lista de tasks
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      const msg = get(error, 'response.data.error') || (error as Error)?.message || 'Erro inesperado';
      toast.error(msg);
    } finally {
      setIsLoading(false);
      closeModalDelete();
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!description || !responsable || !status || !priority) {
      toast.error('Todos os campos devem ter alguma informação');
      return;
    }
    try {
      setIsLoading(true);
      await api.put('/tasks', {
        id: selectedTaskId,
        description,
        responsable,
        status,
        priority,
      });

      closeModalEdit();
      toast.success('Edição realizada com sucesso!');
      // Recarregar a lista de tasks
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.error',
        'Erro ao editar tarefa'
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const norm = (s?: string) => (s ?? '').toLowerCase();

  const tasksFilter = tasks.filter(t => norm(t.description).includes(norm(filter)));
  const statusOf = (t: Task) => norm(t.status);
  const tasksPedings = tasksFilter.filter(t => statusOf(t).startsWith('pendente'));
  const tasksWorking = tasksFilter.filter(t => statusOf(t).startsWith('em-andamento'));
  const tasksDone    = tasksFilter.filter(t => statusOf(t).startsWith('concluida'));

  // Drag and Drop functionality
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-role="task-card"]');
    const columns = document.querySelectorAll<HTMLElement>('[data-role="task-column"]');

    const handleDragStart = (e: DragEvent) => {
      const el = e.currentTarget as HTMLElement | null;
      el?.classList.add('dragging');
      e.dataTransfer?.setData('text/plain', el?.getAttribute('data-task') || '');
    };

    const handleDragEnd = (e: DragEvent) => {
      (e.currentTarget as HTMLElement)?.classList.remove('dragging');
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement)?.classList.add('cards-hover');
    };

    const handleDragLeave = (e: DragEvent) => {
      (e.currentTarget as HTMLElement)?.classList.remove('cards-hover');
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      const col = e.currentTarget as HTMLElement;
      col?.classList.remove('cards-hover');

      const dragCard = document.querySelector<HTMLElement>('.dragging');
      if (!dragCard) return;

      const newStatus = col?.getAttribute('data-status') || '';
      let task: Task | null = null;
      try {
        const taskData = dragCard.getAttribute('data-task');
        if (taskData) task = JSON.parse(taskData) as Task;
      } catch (err) {
        console.warn('Falha ao ler data-task:', err);
        return;
      }
      if (!task) return;

      // Mover visualmente
      col.appendChild(dragCard);

      if (newStatus === task.status) return;

      setIsLoading(true);
      try {
        await api.put('/tasks', { ...task, status: newStatus });
        const response = await api.get('/tasks');
        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Erro ao mover tarefa');
      } finally {
        setIsLoading(false);
      }
    };

    cards.forEach(card => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
    });

    columns.forEach(column => {
      column.addEventListener('dragover', handleDragOver);
      column.addEventListener('dragleave', handleDragLeave);
      column.addEventListener('drop', handleDrop);
    });

    // Cleanup
    return () => {
      cards.forEach(card => {
        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragend', handleDragEnd);
      });
      columns.forEach(column => {
        column.removeEventListener('dragover', handleDragOver);
        column.removeEventListener('dragleave', handleDragLeave);
        column.removeEventListener('drop', handleDrop);
      });
    };
  }, [tasks]);

  return (
    <>
      {isLoading && <Loading />}
      <Title>
        <h1>Tarefas</h1>
        <label htmlFor="filter">
          Filtro de descrição
          <input type="text" name="filter" id="filter" value={filter} onChange={e => setFilter(e.target.value)}/>
        </label>
        {localStorage.getItem('token') !== null && (
          <Link to="/task">
            <FaPlus size={14} />
            Adicionar tarefa
          </Link>
        )}
      </Title>
      <CardsContainer>
        <TaskContainer data-role="task-column" data-status="Pendente">
          <h1>Pendentes</h1>
          {tasksPedings.length > 0 &&
            tasksPedings.map((task) => (
              <Task key={task.id} draggable="true" data-role="task-card" data-task={JSON.stringify(task)}>
                <li>
                  <p>
                    <strong>Descrição:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Responsável:</strong> {task.responsable}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>
                  <p>
                    <strong>Prioridade:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Computador:</strong> {task.computerName}
                  </p>
                  {localStorage.getItem('token') !== null && (
                    <p>
                      <button
                        onClick={() =>
                          openModalEdit(
                            task.id,
                            task.description,
                            task.responsable,
                            task.status,
                            task.priority
                          )
                        }
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="buttonDelete"
                        onClick={() => openModalDelete(task.id)}
                      >
                        <FaWindowClose size={20} />
                      </button>
                    </p>
                  )}
                </li>
              </Task>
            ))
          }
        </TaskContainer>
        <TaskContainer data-role="task-column" data-status="Em-andamento">
          <h1>Em andamento</h1>
          {tasksWorking.length > 0 &&
            tasksWorking.map((task) => (
              <Task key={task.id} draggable="true" data-role="task-card" data-task={JSON.stringify(task)}>
                <li>
                  <p>
                    <strong>Descrição:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Responsável:</strong> {task.responsable}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>
                  <p>
                    <strong>Prioridade:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Computador:</strong> {task.computerName}
                  </p>
                  {localStorage.getItem('token') !== null && (
                    <p>
                      <button
                        onClick={() =>
                          openModalEdit(
                            task.id,
                            task.description,
                            task.responsable,
                            task.status,
                            task.priority
                          )
                        }
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="buttonDelete"
                        onClick={() => openModalDelete(task.id)}
                      >
                        <FaWindowClose size={20} />
                      </button>
                    </p>
                  )}
                </li>
              </Task>
            ))
          }
        </TaskContainer>
        <TaskContainer data-role="task-column" data-status="Concluida">
          <h1>Concluidas</h1>
          {tasksDone.length > 0 &&
            tasksDone.map((task) => (
              <Task key={task.id} draggable="true" data-role="task-card" data-task={JSON.stringify(task)}>
                <li>
                  <p>
                    <strong>Descrição:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Responsável:</strong> {task.responsable}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>
                  <p>
                    <strong>Prioridade:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Computador:</strong> {task.computerName}
                  </p>
                  {localStorage.getItem('token') !== null && (
                    <p>
                      <button
                        onClick={() =>
                          openModalEdit(
                            task.id,
                            task.description,
                            task.responsable,
                            task.status,
                            task.priority
                          )
                        }
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="buttonDelete"
                        onClick={() => openModalDelete(task.id)}
                      >
                        <FaWindowClose size={20} />
                      </button>
                    </p>
                  )}
                </li>
              </Task>
            ))
          }
        </TaskContainer>
      </CardsContainer>
      <Modal
        isOpen={modalDeleteIsOpen}
        onRequestClose={closeModalDelete}
        contentLabel="Example modal"
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <ModalOverlay>
          <ModalContent>
            <section>
              <button className="close" onClick={closeModalDelete}>
                <FaWindowClose size={25} />
              </button>
              <h1>Confirmar exclusão</h1>
              <p>Deseja realmente excluir esta tarefa?</p>
              <div className="buttons">
                <button className="cancel" onClick={closeModalDelete}>
                  Cancelar
                </button>
                <button onClick={handleDelete}>Sim</button>
              </div>
            </section>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal
        isOpen={modalEditIsOpen}
        onRequestClose={closeModalEdit}
        contentLabel="Example modal"
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <ModalOverlay>
          <ModalContent>
            <section>
              <button className="close" onClick={closeModalEdit}>
                <FaWindowClose size={25} />
              </button>
              <h1>Confirmar edição</h1>
              <Form onSubmit={handleSubmit}>
                <label htmlFor="description">
                  Descrição
                  <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </label>
                <label htmlFor="responsable">
                  Responsável
                  <input
                    type="text"
                    name="responsable"
                    value={responsable}
                    onChange={e => setResponsable(e.target.value)}
                  />
                </label>
                <label htmlFor="status">
                  Status
                  <select
                    name="status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em-andamento">Em Andamento</option>
                    <option value="Concluida">Concluída</option>
                  </select>
                </label>
                <label htmlFor="priority">
                  Prioridade
                  <input
                    type="text"
                    name="priority"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  />
                </label>
                <div className="buttons">
                <button className="cancel" onClick={closeModalEdit}>
                  Cancelar
                </button>
                <button type="submit">Editar</button>
              </div>
              </Form>
            </section>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
