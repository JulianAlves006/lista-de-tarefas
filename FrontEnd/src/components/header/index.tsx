import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { Nav } from './styled';

export default function Header() {
  function handleLogOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('id_user');
    window.location.href = '/';
  }
  return (
    <Nav>
      <Link to="/tasks">
        <FaHome size={25} />
      </Link>
      <Link to="/register">
        <FaUserPlus size={25} />
      </Link>
      {localStorage.getItem('token') === null ? (
        <Link className='loginLogout' to="/">
          <FaSignInAlt size={25} />
        </Link>
      ) : (
        <button className='loginLogout' onClick={handleLogOut}>
          <FaSignOutAlt size={25} />
        </button>
      )}
    </Nav>
  );
}
