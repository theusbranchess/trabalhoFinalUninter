import styled, { css } from 'styled-components';

export const MainContainer = styled.div`
  ${() => css`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;

    font-family: Arial;

    color: #4f4f4f;
    h1 { 
      font-weight: bold;   
    }
  `}
`
