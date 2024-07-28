import React from 'react';
import Formulario from '../Formulario';
import Titulo from '../Titulo';
import { MainContainer } from './styles';

const CardComponent: React.FC = () => {

  return (
    <MainContainer>
      <Titulo titulo='Cálculo de Estruturas de Concreto' />
      <Formulario />
    </MainContainer>
  );
}

export default CardComponent;