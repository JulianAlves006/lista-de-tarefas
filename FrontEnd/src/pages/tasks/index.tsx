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
        toast.error(error as string);
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
      const errorMessage = get(
        error,
        'response.data.error',
        'Erro ao deletar tarefa'
      );
      toast.error(errorMessage);
      window.location.reload();
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

  const tasksFilter = tasks.filter((task) => task.description.startsWith(filter));

  const tasksPedings = tasksFilter.filter((task) => task.status.startsWith('Pendente'));
  const tasksWorking = tasksFilter.filter((task) => task.status.startsWith('Em-andamento'));
  const tasksDone = tasksFilter.filter((task) => task.status.startsWith('Concluida'));

  // Drag and Drop functionality
  useEffect(() => {
    const cards = document.querySelectorAll('#task');
    const columns = document.querySelectorAll('#column');

    const handleDragStart = (e: Event) => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.add('dragging');
      }
    };

    const handleDragEnd = (e: Event) => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.remove('dragging');
      }
    };

    const handleDragOver = (e: Event) => {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.add('cards-hover');
      }
    };

    const handleDragLeave = (e: Event) => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.remove('cards-hover');
      }
    };

    const handleDrop = async (e: Event) => {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.remove('cards-hover');
      }
      const dragCard = document.querySelector('.dragging') as HTMLElement;
      if (dragCard && e.currentTarget instanceof HTMLElement) {
        // Capturar informações da coluna e do card
        const newStatus = e.currentTarget.getAttribute('data-status');
        const taskData = dragCard.getAttribute('data-task');
        const task = taskData ? JSON.parse(taskData) : null;

        // Mover o card visualmente
        e.currentTarget.appendChild(dragCard);

        //Editar no back
        if(newStatus === task?.status) return;
        setIsLoading(true);
        try {
          await api.put('/tasks', {
            id: task.id,
            description: task.description,
            responsable: task.responsable,
            status: newStatus,
            priority: task.priority,
          });
          window.location.reload();
        } catch (error) {
          toast.error(error as string);
        }finally{
          setIsLoading(false);
        }
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
        <TaskContainer id="column" data-status="Pendente">
          <h1>Pendentes</h1>
          {tasksPedings.length > 0 &&
            tasksPedings.map((task, index) => (
              <Task id='task' draggable="true" data-task={JSON.stringify(task)} key={index}>
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
        <TaskContainer id="column" data-status="Em-andamento">
          <h1>Em andamento</h1>
          {tasksWorking.length > 0 &&
            tasksWorking.map((task, index) => (
              <Task id='task' draggable="true" data-task={JSON.stringify(task)} key={index}>
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
        <TaskContainer id="column" data-status="Concluida">
          <h1>Concluidas</h1>
          {tasksDone.length > 0 &&
            tasksDone.map((task, index) => (
              <Task id='task' draggable="true" data-task={JSON.stringify(task)} key={index}>
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
