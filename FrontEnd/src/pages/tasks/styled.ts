import styled from 'styled-components';
import { primaryColor } from '../../config/colors';

export const CardsContainer = styled.section`
  display: flex;
  height: 100%;
  margin-top: 15px;
`;

export const TaskContainer = styled.ul`
  border: solid 1px grey;
  border-radius: 10px;
  padding: 10px;
  width: 400px;
  margin: 0px 10px 0px 10px;
  padding: 10px 20px 0 20px;
  height: 98%;

  div + div{
    margin: 10px 0 0px 0;
  }

  h1{
    font-size: 24px;
    text-align: center;
  }
`;

export const Task = styled.div`
  border: 1px solid grey;
  border-radius: 20px;
  padding: 5px 0;
  margin-top: 30px;
  cursor: grab;

  li {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  p {
    margin-top: 8px;
  }

  button {
    border: none;
    color: ${primaryColor};
    background: none;
    cursor: pointer;
    margin-bottom: -10px;
  }

  &:hover{
    border: 1.5px solid ${primaryColor};
  }
`;

export const Title = styled.section`
  margin: 5px;
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
    margin: 15px 10px 0 10px;

    &:hover {
      background: ${primaryColor};
      color: #fff;
    }
  }

  label{
    display: flex;
    flex-direction: column;
    margin-left: auto;
  }

  input {
    height: 30px;
    font-size: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 10px;
    margin-top: 5px;
    transition: all 300ms;

    &:focus {
      border: 1px solid ${primaryColor};
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
