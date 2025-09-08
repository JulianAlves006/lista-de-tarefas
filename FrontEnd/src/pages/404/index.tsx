import { useNavigate } from 'react-router-dom';

import { Container } from '../../style';
import { useState, useEffect } from 'react';

export default function pageNotFound() {
  const [time, setTime] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime < 1) {
          localStorage.getItem('token') ? navigate('/tasks') : navigate('/');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Container>
      <h1>Página não encontrada! Você será redirecionado para a pagina {localStorage.getItem('token') ? ("principal") : ("de login")} em {time}</h1>
    </Container>
  );
}
