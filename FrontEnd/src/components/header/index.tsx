import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { Nav } from './styled';

export default function Header() {
  function handleLogOut(){
    localStorage.removeItem('token')
    window.location.reload()
  }
  return (
    <Nav>
      <Link to="/">
        <FaHome size={25} />
      </Link>
      {localStorage.getItem('token') === null ? (
        <Link to="/login">
          <FaSignInAlt size={25} />
        </Link>
      ) : (
        <button onClick={handleLogOut}>
          <FaSignOutAlt size={25} />
        </button>
      )}
      <Link to="/register">
        <FaUserAlt size={25} />
      </Link>
    </Nav>
  );
}
