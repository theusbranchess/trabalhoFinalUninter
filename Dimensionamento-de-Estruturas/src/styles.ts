import styled, { css } from 'styled-components';
import FundoApp from './assets/img/FundoApp.png';

export const MainContainer = styled.div`
  ${() => css`
    width: 100%;
    height: auto;
    position: absolute;
    background: url(${FundoApp}) no-repeat;
    background-size: cover;
  `}
`