import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Form, Container } from '../../style/index';
import api from '../../services/axios.ts';
import Loading from '../../components/loading/index.tsx';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function handleSubmit(e: any) {
    e.preventDefault();

    let formErrors = false;
    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres');
    }
    if (formErrors) return;
    setIsloading(true);
    try {
      const { data } = await api.post('/users', {
        name,
        email,
        password,
      });
      toast.success("Usuário criado com sucesso!");
      navigate('/');
    } catch (error) {
      const errors = get(error, 'response.data.errors', []) as string[];

      if (errors.length > 0) {
        errors.map(error => toast.error(error));
        return;
      }

      // Tratar erro genérico
      const errorMessage = get(error, 'response.data.error');
      toast.error(errorMessage);
    }finally{
      setIsloading(false);
    }
  }

  return (
    <Container>
      {isLoading && <Loading />}
      <h1>Cadastro de usuário</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Nome
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Senha
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button>Salvar</button>
      </Form>
    </Container>
  );
}
