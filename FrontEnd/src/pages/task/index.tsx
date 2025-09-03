import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import { Container, Form } from '../../style';
import Loading from '../../components/loading';

import api from '../../services/axios';

export default function Task() {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [responsable, setResponsable] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const id_user = localStorage.getItem('id_user');

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!description || !priority || !responsable || !status) {
      toast.error('Todos os campos precisam ser preenchidos');
      return;
    }
    setIsloading(true);
    try {
      const { data } = await api.post('/tasks', {
        description,
        priority,
        responsable,
        status,
        id_user,
      });
      toast.success('Atividade criada com sucesso!');
      navigate('/tasks');
    } catch (error) {
      const errorMessage = get(
        error,
        'response.data.error',
        'Erro ao criar atividade'
      );
      toast.error(errorMessage);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <Container>
      {isLoading && <Loading />}
      <h1>Task</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="description">
          Descrição
          <input
            type="text"
            name="descrption"
            value={description}
            onChange={e => setDescription(e.target.value)}
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
        <label htmlFor="responsable">
          Responsavel
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
            <option value="">Selecione um status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em-andamento">Em Andamento</option>
            <option value="Concluida">Concluída</option>
          </select>
        </label>
        <button>Salvar</button>
      </Form>
    </Container>
  );
}
