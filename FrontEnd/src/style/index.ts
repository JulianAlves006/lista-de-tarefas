import styled, { createGlobalStyle } from 'styled-components';
import { primaryColor } from '../config/colors';

export default createGlobalStyle`
   * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    color: ${primaryColor};
  }

  html, body, #root {
    height: 100%;
  }

  section button {
    cursor: pointer;
    background: ${primaryColor};
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 700;
    transition: all 300ms;
  }

  button:hover {
    filter: brightness(80%);
  }

  a {
    text-decoration: none;
    color: ${primaryColor};
  }

  ul {
    list-style: none;
  }
`;

export const Container = styled.section`
  max-width: 50%;
  background: #fff;
  margin: 30px auto;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &:hover {
    border: 0.5px solid ${primaryColor};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 30px 70px 10px 70px;

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  input {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 10px;
    margin-top: 5px;
    transition: all 300ms;

    &:focus {
      border: 1px solid ${primaryColor};
    }

    &:hover {
      background-color: ${primaryColor};
    }
  }
`;
