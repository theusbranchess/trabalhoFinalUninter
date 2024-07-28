import styled, { css } from 'styled-components';

export const MainContainer = styled.div`
  ${() => css`
    width: 60%;

    background-color: rgba(255, 255, 255, 0.6);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    padding: 50px;

    border-radius: 1.8rem;

    margin: 4rem auto;
    padding: 2rem;
  `}
`