import styles from "@/styles/TelaGuiches.module.css";
import { useState, useEffect } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import axios from "axios";

export default function PainelSenha({dados, onClose}){
    const [senhas, setSenhas] = useState([]);
    const [senhaDetalhes, setSenhaDetalhes] = useState([]);
    const [senhaAndamento, setSenhaAndamento] = useState('');

    useEffect(() => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4NTE5NzY5NCwiZXhwIjoxNjg1MjAxMjk0fQ.ch-6jFDDFhUyZO9OZ8T4ps1ZNA5mv2bMbZqUwav69RY';
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.post('http://10.6.128.114:4000/senhas', {guiche: dados.id}, config)
            .then((val) => {
                console.log(val.data.andamento);
                setSenhaAndamento(val.data.andamento)
                setSenhas(val.data.data);
            })
            .catch((error) => console.log(error));
    }, [dados]);


    function chamarAtendimento(numeroGuiche, numeroSenha){
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4NTE5NzY5NCwiZXhwIjoxNjg1MjAxMjk0fQ.ch-6jFDDFhUyZO9OZ8T4ps1ZNA5mv2bMbZqUwav69RY';
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.post('http://10.6.128.114:4000/chamar', {numero_guiche: numeroGuiche, numero_senha: numeroSenha}, config)
            .then((val) => {
                console.log(val.data.andamento);
                setSenhaAndamento(val.data.andamento)
                setSenhas(val.data.data);
            })
            .catch((error) => console.log(error));
    }


    return(
    <>
        <h1>{dados.numero_guiche}</h1>
        <div className={styles.painelSenhaContainer}>
            <div className={styles.painelSenhaCards}>
            {senhas.length === 0 ? (
                <p>Não há atendimento disponível no momento.</p>
                ) : (
                senhas.map((val) => (
                    <div key={val.id} className={styles.painelSenhaCard} onClick={() => { setSenhaDetalhes(val) }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <BsFillCircleFill style={{ marginRight: '20px', color: 'green' }} />
                        <h2 style={{ margin: '0' }}>SENHA: {val.senha}</h2>
                    </div>
                    <div>
                        <button disabled={senhaAndamento === 'sim'} className={styles.botao}>
                        {val.status === 'indisponivel' ? 'Em atendimento' : 'Chamar'}
                        </button>
                    </div>
                    </div>
                ))
            )}
            </div>
            <div className={styles.painelSenhaDetalhes}>
                {senhaDetalhes.senha ? <>
                 <div className={styles.painelSenhaTexto}>
                    <h1 style={{fontSize: '70px'}}>SENHA: {senhaDetalhes.senha}</h1>
                    <h3><b>Prioridade:</b> {senhaDetalhes.prioridade}</h3>
                    {senhaDetalhes.status === 'indisponivel' ? <h3><b>Status:</b> Em andamento</h3> : ''}
                </div>

                <div className={styles.painelSenhaListaBotoes}>
                    {senhaDetalhes.status !== 'indisponivel' ? <button disabled={senhaAndamento === 'sim' && senhaDetalhes.status !== 'indisponivel'} onClick={()=> chamarAtendimento(dados.numero_guiche, senhaDetalhes.senha)} className={styles.botao}>Chamar</button> : ''}
                    {senhaDetalhes.status == 'indisponivel' && senhaAndamento == 'sim' ? <button className={styles.botao}>Finalizar</button> : ''}
                    <button className={styles.botao}>Cancelar</button> 
                </div>
                </>
                :  ''}
                   
                    
            </div>
        </div>
        <button  className={styles.botao} onClick={()=> onClose(false)}>fechar</button>
    </>)
}