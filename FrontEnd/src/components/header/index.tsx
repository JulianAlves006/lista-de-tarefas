
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { Nav } from './styled';
import { useEffect, useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    const checkLoginStatus = () => {
      if(localStorage.getItem('token') !== null) setIsLogged(true);
      else setIsLogged(false);
    };

    // Verificar status inicial
    checkLoginStatus();

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    // Verificar a cada 100ms se o token mudou (para mudanças na mesma aba)
    const interval = setInterval(checkLoginStatus, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  function handleLogOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogged(false);
    navigate('/');
  }
  return (
    <Nav>
      <Link to="/tasks">
        <FaHome size={25} />
      </Link>
      {isLogged &&
        <Link to='/user'>
          <FaUserAlt size={23}/>
        </Link>
      }
      {isLogged ? (
        <button className='loginLogout' onClick={handleLogOut}>
          <p>Deslogar</p><FaSignOutAlt size={25} />
        </button>
      ) : (
        <Link className='loginLogout' to="/">
          <p>Logar / Registrar</p><FaSignInAlt size={25} />
        </Link>
      )}
    </Nav>
  );
}
