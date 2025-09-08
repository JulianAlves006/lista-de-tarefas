import styled from 'styled-components';
import { primaryColor } from '../../config/colors';

export const Nav = styled.nav`
  background: ${primaryColor};
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  a {
    color: #fff;
    margin: 0 10px 0 0;
    font-weight: bold;
    padding: 0 10px;

    &:hover{
      filter: brightness(80%);
    }
  }

  button{
    color: #fff;
    margin: 0 10px 0 0;
    font-weight: bold;
    padding: 0 10px;
    cursor: pointer;
    background: none;
    border: none;
  }

  .loginLogout{
    margin-left: auto;
    display: flex;
    align-items: center;

    p{
      margin-right: 10px;
      font-size: 15px;
    }
  }
`;
