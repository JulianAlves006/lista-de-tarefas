import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 30px;

  div {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1001;
  }

  span {
    z-index: 1002;
  }
`;
