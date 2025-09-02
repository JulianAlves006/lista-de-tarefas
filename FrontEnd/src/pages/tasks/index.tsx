import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaWindowClose, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { Container, Form } from '../../style';
import api from '../../services/axios';
import { TaskContainer, Title, ModalOverlay, ModalContent } from './styled';
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
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        toast.error('Erro ao carregar tarefas');
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
    setIsLoading(true);
    try {
      await api.put('/tasks', {
        id: selectedTaskId,
        description,
        responsable,
        status,
        priority,
      });
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
      closeModalEdit();
    }
  }

  return (
    <Container>
      {isLoading && <Loading />}
      <Title>
        <h1>Tasks</h1>
        {localStorage.getItem('token') !== null && (
          <Link to="/task">
            <FaPlus size={14} />
            Adicionar task
          </Link>
        )}
      </Title>
      <TaskContainer>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index}>
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
            </div>
          ))
        ) : (
          <p>Nenhuma task encontrada</p>
        )}
      </TaskContainer>
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
                  <input
                    type="text"
                    name="status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  />
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
    </Container>
  );
}
