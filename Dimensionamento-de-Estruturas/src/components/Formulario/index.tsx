import React, { useState } from 'react';
import { Form, FormGroup, Button, ButtonGroup, Input } from 'reactstrap';
import { MainContainer } from './styles';
import { GiBroom } from 'react-icons/gi';
import { TbMathFunction } from 'react-icons/tb';

const Formulario: React.FC = () => {
  const [result, setResult] = useState<string>();
  const [resultBx, setResultBx] = useState<string>();
  const [resultArmPositiva, setResultArmPositiva] = useState<string>();
  const [resultArmNegativa, setResultArmNegativa] = useState<string>();
  const [resultEscoamento, setResultEscoamento] = useState<string>();
  const [resultNaoEscoamento, setResultNaoEscoamento] = useState<string>();
  const [resultTipoArmadura, setResultTipoArmadura] = useState<string>();
  const [resultMomentoArmDupla, setResultMomentoArmDupla] = useState<string>();
  const [error, setError] = useState<boolean>(false);
  const [errorLabel, setErrorLabel] = useState<string>();

  // VARIABLES
  const [isViga, setIsViga] = useState<boolean>(true);
  const [isLaje, setIsLaje] = useState<boolean>(false);
  const [isPilar, setIsPilar] = useState<boolean>(false);
  const [tipoArmadura, setTipoArmadura] = useState<string>('Simples');
  const [isDimensionamento, setIsDimensionamento] = useState<boolean>(true);
  const [classeConcreto, setClasseConcreto] = useState<number>(2);
  const [classeAco, setClasseAco] = useState<number>(50);
  const [momentoFletor, setMomentoFletor] = useState<string>('');
  const [momentoFletorValidation, setMomentoFletorValidation] = useState<boolean>(false);
  const [areaAcoPositivo, setAreaAcoPositivo] = useState<string>('');
  const [areaAcoNegativo, setAreaAcoNegativo] = useState<string>('');
  const [areaAcoPositivoValidation, setAreaAcoPositivoValidation] = useState<boolean>(false);
  const [areaAcoNegativoValidation, setAreaAcoNegativoValidation] = useState<boolean>(false);
  const [base, setBase] = useState<string>('');
  const [baseValidation, setBaseValidation] = useState<boolean>(false);
  const [alturaUtil, setAlturaUtil] = useState<string>('');
  const [delinha, setDelinha] = useState<string>('');
  const [delinhaValidation, setDelinhaValidation] = useState<boolean>(false);
  const [alturaUtilValidation, setAlturaUtilValidation] = useState<boolean>(false);
  const [altura, setAltura] = useState<string>('');
  const [alturaValidation, setAlturaValidation] = useState<boolean>(false);

  const concreteOptions = [
    {id: 0, label: 'C20', valor: 2},
    {id: 1, label: 'C25', valor: 2.5},
    {id: 2, label: 'C30', valor: 3},
    {id: 3, label: 'C35', valor: 3.5},
    {id: 4, label: 'C40', valor: 4},
    {id: 5, label: 'C45', valor: 4.5},
    {id: 6, label: 'C50', valor: 5}
  ];
  
  const steelOptions = [
    {id: 0, label: 'CA-50', valor: 50},
    {id: 1, label: 'CA-60', valor: 60}
  ];

  const armaduraOptions = [
    {id: 0, label: 'Simples', valor: 'Simples'},
    {id: 1, label: 'Dupla', valor: 'Dupla'}
  ];

  const handleTipoCalculo = (value: boolean) => {
    setIsDimensionamento(value);
    limparCampos();
  }

  const handleClasseConcreto = (event: any) => {
    setClasseConcreto(event.target.value);
  }
  
  const handleClasseAco = (event: any) => {
    setClasseAco(event.target.value);
  }

  const handleTipoMomento = (event: any) => {
    setTipoArmadura(event.target.value);
  }

  const handleVigaStructure = () => {
    limparCampos();
    setBase('');
    setIsViga(true);
    setIsLaje(false);
    setIsPilar(false);
  }

  const handleLajeStructure = () => {
    limparCampos();
    setBase('100');
    setIsViga(false);
    setIsLaje(true);
    setIsPilar(false);
  }

  const handlePilarStructure = () => {
    setBase('');
    setIsViga(false);
    setIsLaje(false);
    setIsPilar(true);
  }

  const calcularBhaskara = (A: number, B: number, C: number) => {
    let delta = Math.pow(B, 2) - (4 * A * C);

    if (delta < 0) {
      return 0.45;
    }

    delta = Math.sqrt(delta);

    const x1 = (-B + delta) / (2 * A);
    const x2 = (-B - delta) / (2 * A);

    if (x1 > 0 && x1 < 1) {
      return x1;
    } 
    else if (x2 > 0 && x2 < 1) {
      return x2;
    }
    else {
      return -1;
    }
  }

  const calculoBxAnaliseSimples = (tensaoAco: number, areaAcoPositivo: number, fcd: number, base: number, altUtil: number) => {
    const Bx = (tensaoAco * areaAcoPositivo) / (0.68 * fcd * base * altUtil);
    return Bx;
  }

  const calculoBxAnaliseDupla = (tensaoAco: number, areaAcoPositivo: number, areaAcoNegativo:number, fcd: number, base: number, altUtil: number, delinha: number, BxEscoamento: any, dominio: any) => {
    const Bx = ((tensaoAco * areaAcoPositivo) - (tensaoAco * areaAcoNegativo)) / (0.68 * fcd * base * altUtil);
    let calculaTensaoArmNegativa = -1;

    if (dominio == 3){
      if (Bx >= BxEscoamento && Bx <= 0.45){
        return [Bx]
      }

      else {
        const A = -(0.68 * fcd * base * altUtil);
        const B = ((0.68 * fcd * base * altUtil) + (210 * areaAcoNegativo) + (tensaoAco * areaAcoPositivo));
        const C = -(((210 * (delinha / altUtil)) * areaAcoNegativo) + (tensaoAco * areaAcoPositivo));
        const Bx = calcularBhaskara(A, B, C);

        calculaTensaoArmNegativa = (210 * (Bx - (delinha / altUtil)) / (1 - Bx));
        return [Bx, calculaTensaoArmNegativa]
      }
    }
    else{
      if (Bx >= BxEscoamento && Bx <= 0.2593){
        return [Bx]
      }

      else {
        //falta fazer aqui
        return [Bx]
      }
    }
  }

  const calcularMomentoAnaliseSimples = (fcd: number, base: number, altUtil: number, Bx: number) => {
      const momentoAnaliseSimples = 0.68 * fcd * base * (altUtil**2) * Bx * (1 - (0.4 *Bx));
      return momentoAnaliseSimples;
  }

  const calcularMomentoAnaliseDupla = (fcd: number, base: number, altUtil: number, Bx: number, tensaoArmNegativa: number, areaAcoNegativo: number, delinha: number) => {
    const momentoFletor = 0.68 * fcd * base * (altUtil**2) * Bx * (1 - (0.4 * Bx)) + ((tensaoArmNegativa * areaAcoNegativo) * (altUtil - delinha));
    return momentoFletor;
  }

  const calcularAreaAcoDimensionamento = (bx: number, b: number, altUtil: number) => {
    const areaAcoSimples = (0.68 * (classeConcreto / 1.4) * b * altUtil * bx) / (classeAco / 1.15);

    return areaAcoSimples;
  }

  const escoamentoArmaduraDupla = (altUtil: number, dezinho: number) => {
    
    let escoamento = true;

    let Bx = ((0.00207*altUtil) + (0.01*dezinho))/((0.01*altUtil) + (0.00207*altUtil));
    let dominio = 2;
    
    if (Bx >= 0.2593 && Bx <= 0.45) { //arrumar intervalo de Bx
      Bx = ((0.0035*dezinho)) / ((0.0035 * altUtil) - (0.00207 * altUtil));
      dominio = 3;
    }

    if (Bx > 0.45) {
      //condição p/ caso não ocorra escoamento da armadura negativa
      escoamento = false;
    }

    return [dominio, escoamento, Bx];
  }

  const calcularArmaduraDuplaDimensionamento = (mf: number, altUtil: number, dezinho: number, b: number, fcd: number, fyd: number, escoamento: any) => {

    let tensaoArmNegativa = fyd;

    if (!escoamento) {
      tensaoArmNegativa = (210 * (0.45 - (dezinho / altUtil)) / (1 - 0.45))
    }

    const armNegativa = (mf - 0.68 * (fcd) * b * (altUtil**2) * 0.45 * (1 - 0.4 * 0.45)) / (tensaoArmNegativa * (altUtil - dezinho));
    const armPositiva = (0.68 * fcd * b * altUtil * 0.45 + (tensaoArmNegativa * armNegativa)) / (fyd);
    return [armPositiva, armNegativa, tensaoArmNegativa];
  }

  const validaFormulario = () => {
    let validationError = true;

    if (isViga && !isDimensionamento) {
      const delinhaValidation = !delinha;
      setDelinhaValidation(delinhaValidation);

      const validationBase = !base;
      setBaseValidation(validationBase);

      const validationAreaAcoPositivo = !areaAcoPositivo;
      setAreaAcoPositivoValidation(validationAreaAcoPositivo);

      const validationAltura = !altura;
      setAlturaValidation(validationAltura);

      const validationAlturaUtil = !alturaUtil;
      setAlturaUtilValidation(validationAlturaUtil);

      let validationAreaAcoNegativo = true;
      if (tipoArmadura != 'Simples'){
        validationAreaAcoNegativo = !areaAcoNegativo;
        setAreaAcoNegativoValidation(validationAreaAcoNegativo);
        validationError =  delinhaValidation || validationBase || validationAltura || validationAlturaUtil || validationAreaAcoPositivo || validationAreaAcoNegativo;
      }

      else{
        validationError =  delinhaValidation || validationBase || validationAltura || validationAlturaUtil || validationAreaAcoPositivo;
      }
    }

    else if (isViga && isDimensionamento) {
      const validationMomentoFletor = !momentoFletor;
      setMomentoFletorValidation(validationMomentoFletor);

      const delinhaValidation = !delinha;
      setDelinhaValidation(delinhaValidation);

      const validationBase = !base;
      setBaseValidation(validationBase);

      const validationAltura = !altura;
      setAlturaValidation(validationAltura);

      const validationAlturaUtil = !alturaUtil;
      setAlturaUtilValidation(validationAlturaUtil);

      validationError =  validationMomentoFletor || delinhaValidation || validationBase || validationAltura || validationAlturaUtil;
    }

    else if (isLaje) {
      const validationMomentoFletor = !momentoFletor;
      setMomentoFletorValidation(validationMomentoFletor);

      const validationAltura = !altura;
      setAlturaValidation(validationAltura);

      const validationAlturaUtil = !alturaUtil;
      setAlturaUtilValidation(validationAlturaUtil);

      validationError = validationMomentoFletor || validationAltura || validationAlturaUtil;
    }

    if (validationError) {
      setErrorLabel('Campos obrigatórios não preenchidos');
      setResult('');
    }

    setError(validationError);
    return validationError;
  }

  const calcularResultado = () => {
    if (validaFormulario()) {
      return;
    }

    limparRespostas();

    let saidaEscoamento = 'Houve um erro';
    let saidaNaoEscoamento = 'Houve um erro';
    const b = parseFloat(base);
    const altUtil = parseFloat(alturaUtil);
    const alt = parseFloat(altura);
    const dezinho = parseFloat(delinha);
    const fcd = (classeConcreto / 1.4);
    const fyd = (classeAco / 1.15);

    if (isViga || isLaje) {

      if (isDimensionamento) {
        let C = 0;
        const mf = parseFloat(momentoFletor);
        
        C = mf / (0.68 * fcd * b * Math.pow(altUtil, 2));
        const baskhara = calcularBhaskara(-0.4, 1, -C);

        if (baskhara > 0 && baskhara < 0.1667) {
          console.log('condição 1 (2a)');
        }

        else if (baskhara >= 0.1667 && baskhara < 0.45) {
          const saidaArmaduraSimples = 'A seção NÃO necessita de armadura dupla.';
          const resultadoAreaAcoSimples = calcularAreaAcoDimensionamento(baskhara, b, altUtil) || 0;
          setResultTipoArmadura(saidaArmaduraSimples);
          setResultBx(baskhara.toFixed(4).replace('.', ','));
          setResult(resultadoAreaAcoSimples.toFixed(4).replace('.', ','));
        }

        else if (baskhara >= 0.45) {
          const saidaArmaduraDupla = 'A seção necessita de armadura dupla.';
          const [dominio, escoamento] = escoamentoArmaduraDupla(altUtil, dezinho);
          const [armPositiva, armNegativa, tensaoArmNegativa] = calcularArmaduraDuplaDimensionamento(mf, altUtil, dezinho, b, fcd, fyd, escoamento);

          if (!escoamento){
            saidaNaoEscoamento = 'Não há escoamento da armadura comprimida, sua tensão calculada é de: ' + tensaoArmNegativa.toFixed(4);
            setResultNaoEscoamento(saidaNaoEscoamento);
          }
          else{
            saidaEscoamento = 'A armadura comprimida entra em escoamento no domínio ' + dominio + ', e sua tensão é igual a fyd.';
            setResultEscoamento(saidaEscoamento);
          }
          setResultTipoArmadura(saidaArmaduraDupla);
          setResultArmPositiva(armPositiva.toFixed(4).replace('.', ','));
          setResultArmNegativa(armNegativa.toFixed(4).replace('.', ','));
        }
        else {
          setError(true);
          setResult('');
          setErrorLabel('Erro ao cálcular: valores resultam raizes inválidas');
        }
      }

      else {
        let Bx = 0; //temporário
        const acoPositivo = parseFloat(areaAcoPositivo);
        let tensaoArmNegativa = fyd;
        
        if (tipoArmadura === 'Dupla') {
          let saidaEscoamento = 'Houve um erro';
          const acoNegativo = parseFloat(areaAcoNegativo);

          const [dominio, escoamento, BxEscoamento] = escoamentoArmaduraDupla(altUtil, dezinho);
          

          const [Bx, calculaTensaoArmNegativa] = calculoBxAnaliseDupla(fyd, acoPositivo, acoNegativo, fcd, b, altUtil, dezinho, BxEscoamento, dominio) || 0;
          
          if (calculaTensaoArmNegativa > 0) {
            tensaoArmNegativa = calculaTensaoArmNegativa;
          }

          const momentoAnaliseDupla = calcularMomentoAnaliseDupla(fcd, b, altUtil, Bx, tensaoArmNegativa, acoNegativo, dezinho);
          
          if (Bx < BxEscoamento){
            saidaNaoEscoamento = 'Não há escoamento da armadura comprimida, sua tensão calculada é de: ' + tensaoArmNegativa.toFixed(4);
            setResultNaoEscoamento(saidaNaoEscoamento);
          }
          else{
            saidaEscoamento = 'A armadura comprimida entra em escoamento no domínio ' + dominio + ', e sua tensão é igual a fyd.';
            setResultEscoamento(saidaEscoamento);
          }
          setResultBx(Bx.toFixed(4).replace('.', ','));
          setResultMomentoArmDupla(momentoAnaliseDupla.toFixed(4).replace('.', ','));
        }

        else {
          const Bx = calculoBxAnaliseSimples(fyd, acoPositivo, fcd, b, altUtil);
          const momentoAnaliseSimples = calcularMomentoAnaliseSimples(fcd, b, altUtil, Bx);

          setResultBx(Bx.toFixed(4).replace('.', ','));
          setResultMomentoArmDupla(momentoAnaliseSimples.toFixed(4).replace('.', ','));
        }
      }
    }
  }

  const limparCampos = () => {
    setClasseConcreto(2);
    setClasseAco(50);
    setAreaAcoPositivo('');
    setAreaAcoPositivoValidation(false);
    setAreaAcoNegativo('');
    setAreaAcoNegativoValidation(false);
    setMomentoFletor('');
    setMomentoFletorValidation(false);
    setBase('');
    setBaseValidation(false);
    setAltura('');
    setAlturaValidation(false);
    setAlturaUtil('');
    setAlturaUtilValidation(false);
    setDelinha('');
    setDelinhaValidation(false);
    setResultTipoArmadura('');
    setResultEscoamento('');
    setResultArmPositiva('');
    setResultArmNegativa('');
    setResult('');
    setResultBx('');
    setResultArmPositiva('');
    setResultArmNegativa('');
    setResultNaoEscoamento('');
    setResultTipoArmadura('');
    setResultMomentoArmDupla('');
    setError(false);
  }

  const limparRespostas = () => {
    setResultTipoArmadura('');
    setResultEscoamento('');
    setResultArmPositiva('');
    setResultArmNegativa('');
    setResult('');
    setResultBx('');
    setResultArmPositiva('');
    setResultArmNegativa('');
    setResultNaoEscoamento('');
    setResultTipoArmadura('');
    setResultMomentoArmDupla('');
    setError(false);
  }

  return (
    <MainContainer>
      <Form>
        <FormGroup className="form-group" check>
          <p> Selecione para qual estrutura será feito o cálculo:</p>
          <ButtonGroup>
            <Button
              outline
              onClick={handleVigaStructure}
              active={isViga}
            >
              Viga
            </Button>
            <Button
              outline
              onClick={handleLajeStructure}
              active={isLaje}
            >
              Laje maciça
            </Button>
          </ButtonGroup>
        </FormGroup>
        <FormGroup check>
            
          <p> Escolha o tipo de cálculo:</p>
          <ButtonGroup>
            <Button
              outline
              onClick={() => handleTipoCalculo(true)}
              active={isDimensionamento}
            >
              Dimensionamento
            </Button>
            <Button
              outline
              onClick={() => handleTipoCalculo(false)}
              active={!isDimensionamento}
            >
              Análise
            </Button>
          </ButtonGroup>
        </FormGroup>
        <div className="classes">
          <FormGroup className="select-options">
            <p> Selecione a classe do concreto: </p>
            <Input
              className="mb-3"
              type="select"
              onChange={(event) => handleClasseConcreto(event)}
              value={classeConcreto}
            >
              {concreteOptions.map(opt => <option key={opt.id} value={opt.valor}> {opt.label} </option>)}
            </Input>
          </FormGroup>
          <FormGroup className="select-options">
            <p> Selecione a classe do aço: </p>
            <Input
              className="mb-3"
              type="select"
              onChange={(event) => handleClasseAco(event)}
              value={classeAco}
            >
              {steelOptions.map(opt => <option key={opt.id} value={opt.valor}> {opt.label} </option>)}
            </Input>

          </FormGroup>

          {!isDimensionamento && isViga &&
            <FormGroup className="select-options">
              <p> Selecione o tipo da armadura: </p>
              <Input
                className="mb-3"
                type="select"
                onChange={(event) => handleTipoMomento(event)}
                value={tipoArmadura}
              >
                {armaduraOptions.map(opt => <option key={opt.id} value={opt.valor}> {opt.label} </option>)}
              </Input>
            </FormGroup>
          }

        </div>
        <FormGroup className="variables">
          {isDimensionamento && (
            <div className="number-input">
              <p>Momento fletor <span className="unidades">(kN.cm)</span></p>
              <Input invalid={momentoFletorValidation} value={momentoFletor} className="md" type="number" onChange={(event) => {setMomentoFletor(event.target.value)}} />
            </div>  
          )}
          {!isDimensionamento && isViga &&(
            <div className="number-input">
              <p>Área de aço positiva <span className="unidades-respostas">(cm²)</span></p>
              <Input invalid={areaAcoPositivoValidation} value={areaAcoPositivo} className="md" type="number" onChange={(event) => {setAreaAcoPositivo(event.target.value)}} />
            </div>  
          )}
          {!isDimensionamento && isLaje &&(
            <div className="number-input">
              <p>Área de aço<span className="unidades">(cm²)</span></p>
              <Input invalid={areaAcoPositivoValidation} value={areaAcoPositivo} className="md" type="number" onChange={(event) => {setAreaAcoPositivo(event.target.value)}} />
            </div>  
          )}
          {!isDimensionamento && tipoArmadura === "Dupla" &&(
            <div className="number-input">
              <p>Área de aço negativa <span className="unidades-respostas">(cm²)</span></p>
              <Input invalid={areaAcoNegativoValidation} value={areaAcoNegativo} className="md" type="number" onChange={(event) => {setAreaAcoNegativo(event.target.value)}} />
            </div>  
          )}
          {isViga && (
            <div className="number-input">
              <p>Base <span className="unidades">(cm)</span></p>
              <Input invalid={baseValidation} value={base} className="md" type="number" onChange={(event) => {setBase(event.target.value)}} />
            </div>
          )}
          <div className="number-input">
            <p>Altura <span className="unidades">(cm)</span></p>
            <Input invalid={alturaValidation} value={altura} className="md" type="number" onChange={(event) => {setAltura(event.target.value)}} />
          </div>  
          <div className="number-input">
            <p>Altura útil <span className="unidades">(cm)</span></p>
            <Input invalid={alturaUtilValidation} value={alturaUtil} className="md" type="number" onChange={(event) => {setAlturaUtil(event.target.value)}} />
          </div>
          <div className="number-input">
            <p>d' <span className="unidades">(cm)</span></p>
            <Input invalid={delinhaValidation} value={delinha} className="md" type="number" onChange={(event) => {setDelinha(event.target.value)}} />
          </div>  
        </FormGroup>
        <div className="result">
              <>
                {resultArmPositiva &&
                  <p>Área armadura positiva: <span className="result-number">{resultArmPositiva}</span><span className="unidades-respostas"> cm²</span></p>
                }
                {resultArmNegativa &&
                  <p>Área armadura negativa: <span className="result-number">{resultArmNegativa}</span><span className="unidades-respostas"> cm²</span></p>
                }
                {resultBx &&
                  <p>Bx: <span className="result-number">{resultBx}</span><span className="unidades-respostas"></span></p>
                }
                {result &&
                <p>Área de aço: <span className="result-number">{result}</span><span className="unidades-respostas"> cm²</span></p>
                }
                {resultTipoArmadura &&
                  <p><span className="result-number">{resultTipoArmadura}</span><span className="unidades-respostas"></span></p>
                }
                {resultEscoamento &&
                  <p><span className="result-number">{resultEscoamento}</span><span className="unidades-respostas"></span></p>
                }
                {resultNaoEscoamento &&
                  <p><span className="result-number">{resultNaoEscoamento}</span><span className="unidades-respostas"> kN/cm².</span></p>
                }
                {resultMomentoArmDupla &&
                  <p>Momento fletor: <span className="result-number">{resultMomentoArmDupla}</span><span className="unidades-respostas"> kN.cm</span></p>
                }
              </>
            {error && <p className="error">*{errorLabel}</p> }
        </div>
        <div className="btn-footer">
          <Button className="btn-calcular" onClick={limparCampos}>
            <GiBroom className="icon" size={20} />
            Limpar
          </Button>
          <Button className="btn-calcular" onClick={calcularResultado}>
            <TbMathFunction className="icon" size={20} />
            Calcular
          </Button>
        </div>
      </Form>
    </MainContainer>
  );
}

export default Formulario;