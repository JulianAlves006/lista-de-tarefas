import styled from 'styled-components';
import { primaryColor } from '../../config/colors';

export const TaskContainer = styled.ul`
  margin-top: 20px;
  padding: 10px;
  div {
    padding: 5px 0;
  }

  div + div {
    border-top: 1px solid #ccc;
  }

  li {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  p {
    margin-top: 8px;
  }

  a {
    transition: all 300ms;
    &:hover {
      filter: brightness(80%);
    }
  }

  button {
    border: none;
    color: ${primaryColor};
    background: none;
    cursor: pointer;
    margin-bottom: -10px;
  }
`;

export const Title = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 25px;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 8px;
    border: solid 1px ${primaryColor};
    border-radius: 4px;
    transition: all 300ms;

    &:hover {
      background: ${primaryColor};
      color: #fff;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;

  animation: fadeInUp 0.25s ease forwards;

  h1 {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 16px;
    color: #1e293b;
    font-weight: 600;
    text-align: center;
  }

  p {
    margin-bottom: 20px;
    color: grey;
    text-align: center;
  }

  div.buttons {
    display: flex;
    justify-content: flex-end;
    padding: 5px;

    button {
      margin-left: 10px;
    }

    .cancel {
      background: none;
      color: ${primaryColor};
      &:hover{
        color: black;
        background:rgb(255, 108, 108);
      }
    }
  }

  button.close {
    background: transparent;
    border: none;
    position: absolute;
    top: 14px;
    left: 14px;
    cursor: pointer;
    color: #555;
    transition: color 0.2s;

    &:hover {
      color: #e11d48;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
