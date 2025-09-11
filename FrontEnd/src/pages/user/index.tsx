import React, { useEffect, useState } from 'react';
import { Container, Form } from '../../style';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import api from '../../services/axios';
import { get } from 'lodash';
import Loading from '../../components/loading';
import { Password } from './styled';

export default function User() {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
  console.log(userData);

  useEffect(() => {
    if(user === null && localStorage.getItem('token') === null){
      toast.error('Você precisa fazer login para poder editar seu usuário');
      navigate('/');
      return;
    } else {
      setName(userData?.name || '');
      setEmail(userData?.email || '');
      setPassword(userData?.password || '');
    }
  }, []);

  async function handleSubmit(e:any) {
    e.preventDefault();
    if(!isEmail(email)){
      toast.error('Email inválido');
      return;
    }
    if(!name || !email || !password){
      toast.error('Todas as informações devem estar preenchidas para a edição!');
      return;
    }
    setIsloading(true);
    try {
      const response = await api.put('/users', {
        id: userData.id,
        name,
        email,
        password
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success(response.data.message);
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

  return(
    <>
      {isLoading && <Loading></Loading>}
      <Container>
        <h1>Registro</h1>
        <Form onSubmit={handleSubmit}>
          <label htmlFor="Name">
            Nome
            <input type="text" value={name} placeholder='Nome' onChange={e => setName(e.target.value)}/>
          </label>
          <label htmlFor="Email">
            Email
            <input type="text" value={email} placeholder='Email' onChange={e => setEmail(e.target.value)}/>
          </label>
          <Password />
          <label htmlFor="Password">
            Senha
            <input type="text" value={password} placeholder='Senha' onChange={e => setPassword(e.target.value)}/>
          </label>
          <button>Enviar</button>
        </Form>
        <p>É necessário inserir a mesma senha de login para poder realizar a edição (A senha não será editada, somente validada para poder editar as demais informações)</p>
      </Container>
    </>
  )
}
