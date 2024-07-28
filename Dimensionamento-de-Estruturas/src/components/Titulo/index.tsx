import React from 'react';
import { MainContainer } from './styles';

interface ITituloProps {
  titulo: string;
}

const Titulo: React.FC<ITituloProps> = ({ titulo }: ITituloProps) => {

  return (
    <MainContainer>
      <h1> {titulo} </h1>
    </MainContainer>
  );
}

export default Titulo;