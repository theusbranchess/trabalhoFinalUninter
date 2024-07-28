import styled, { css } from 'styled-components';

export const MainContainer = styled.div`
  ${() => css`
    width: 100%;
    height: 100%;

    .form-group {
      margin-bottom: 2rem;
    }

    p { 
      font-weight: bold;
    }

    .classes {
      display: flex;
      .select-options {
        margin-left: 1.6rem;
        margin-top: 1.6rem;
        width: 25%;
      }
    }

    .unidades {
      font-weight: normal;
      font-size: 14px;
      font-style: italic;
      display: block;
      justify-content: center;
    }

    .unidades-respostas {
      font-weight: normal;
      font-size: 14px;
      font-style: italic;
    }

    .variables {
      display: flex;

      .number-input {
        margin-left: 1.6rem;
        .md {
          width: 65%;
        }
      }
    }

    .result {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      margin-top: 3rem;

      .result-number {
        font-weight: normal;
        font-size: 16px;
      }

      .error {
        color: #b22222
      }
    }

    .btn-footer {
      display: flex;
      justify-content: center;

      margin-top: 3rem;

      .btn-calcular {
        width: 300px;
        margin: 0 auto;
      }

      .icon {
        margin-right: 0.5rem;
      }
    }
  `}
`
