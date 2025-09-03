import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';

import { Container, Form } from '../../style';
import api from '../../services/axios';
import Loading from '../../components/loading';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function handleSubmit(e: any) {
    e.preventDefault();
    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Email inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deve ter entre 6 e 50 caracteres');
    }
    if (formErrors) return;
    setIsLoading(true);
    try {
      const { data } = await api.post('/login', {
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('id_user', data.user.id)
      toast.success('Login realizado com sucesso!');
      window.location.href = '/tasks';
    } catch (error) {
      const errors = get(error, 'response.data.errors', []) as string[];

      if (errors.length > 0) {
        errors.map(error => toast.error(error));
        return;
      }

      // Tratar erro genérico
      const errorMessage = get(error, 'response.data.error');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Container>
      {isLoading && <Loading />}
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
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
        <button type="submit">Entrar</button>
      </Form>
    </Container>
  );
}
