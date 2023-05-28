import styles from "@/styles/TelaGuiches.module.css";
import { useState, useEffect } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import { FcHighPriority, FcInspection } from "react-icons/fc";
import axios from "axios";
import { io } from 'socket.io-client'
import acessToken from "../api/token";

export default function PainelSenha({dados, onClose}){
    const [senhas, setSenhas] = useState([]);
    const [senhaDetalhes, setSenhaDetalhes] = useState([]);
    const [senhaAndamento, setSenhaAndamento] = useState('');
    const [socket, setSocket] = useState(null);
    const [atualizacao, setAtualizacao] = useState('');
    var token = acessToken()

    useEffect(() => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.post('http://192.168.0.107:4000/senhas', {guiche: dados.id}, config)
            .then((val) => {
                console.log(val.data.andamento);
                setSenhaAndamento(val.data.andamento)
                setSenhas(val.data.data);
            })
            .catch((error) => console.log(error));
    }, [dados, atualizacao]);

    useEffect(() => {
        const socket = io('http://localhost:3001')
        setSocket(socket)
        socket.on('connect', () => {
            console.log('conectado')
        })
    
        socket.on('disconnect', () => {
          console.log('disconnected')
        })

    
        socket.on('cardRender', async (msg)=>{
            setAtualizacao(msg)
        })
    
        return () => {
          socket.disconnect()
        }
      }, [])

      function converteData(data) {
        const convertedDate = new Date(data).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
        return convertedDate;
      }

    function chamarAtendimento(numeroGuiche, numeroSenha){
        
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.post('http://192.168.0.107:4000/chamar', {numero_guiche: numeroGuiche, numero_senha: numeroSenha}, config)
            .then((val) => {
                socket.emit('cardRender', numeroSenha)
                senhaDetalhes.status = 'indisponivel'
                setSenhaDetalhes(senhaDetalhes)
            })
            .catch((error) => console.log(error));
    }


    function finalizarAtendimento(numeroSenha, numeroGuiche){
       
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.post('http://192.168.0.107:4000/finalizar', {senha: numeroSenha, guiche: numeroGuiche}, config)
            .then((val) => {
                socket.emit('cardRender', numeroSenha+'1')
                setSenhaDetalhes([])
            })
            .catch((error) => console.log(error));
    }

    function cancelarAtendimento(numeroSenha, numeroGuiche){
       
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.post('http://192.168.0.107:4000/cancelar', {senha: numeroSenha, guiche: numeroGuiche}, config)
            .then((val) => {
                socket.emit('cardRender', numeroSenha+'1')
                setSenhaDetalhes([])
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
                        {val.tipo_atendimento == 'prioridade' ? <FcHighPriority style={{ marginRight: '20px', fontSize: '30px' }} />: ''}
                        {val.tipo_atendimento == 'exame' ? <FcInspection style={{ marginRight: '20px', fontSize: '30px' }} />: ''}
                        <h2 style={{ margin: '0' }}>SENHA: {val.senha}</h2>
                    </div>
                    <div>
                        {val.status === 'indisponivel' ? <h3 style={{ margin: '0' }}><b>Em andamento</b></h3> : <h3 style={{ margin: '0' }}><b>Em aberto</b></h3>}
                        <p style={{ margin: '0' }}>Data: {converteData(val.createdAt)}</p>  
                    </div>
                    </div>
                ))
            )}
            </div>
            <div className={styles.painelSenhaDetalhes}>
                {senhaDetalhes.senha ? <>
                 <div className={styles.painelSenhaTexto}>
                    <h1 style={{fontSize: '70px'}}>SENHA: {senhaDetalhes.senha}</h1>
                    <h3><b>Tipo de atendimento:</b> {senhaDetalhes.tipo_atendimento}</h3>
                    {senhaDetalhes.status === 'indisponivel' ? <h3><b>Status:</b> Em andamento</h3> : ''}
                </div>

                <div className={styles.painelSenhaListaBotoes}>
                    {senhaDetalhes.status !== 'indisponivel' ? <button disabled={senhaAndamento === 'sim' && senhaDetalhes.status !== 'indisponivel'} onClick={()=> chamarAtendimento(dados.numero_guiche, senhaDetalhes.senha)} className={styles.botao}>Chamar</button> : ''}
                    {senhaDetalhes.status == 'indisponivel' && senhaAndamento == 'sim' ? <button onClick={()=> finalizarAtendimento(senhaDetalhes.senha, dados.numero_guiche)} className={styles.botaoF}>Finalizar</button> : ''}
                    <button onClick={()=> cancelarAtendimento(senhaDetalhes.senha, dados.numero_guiche)} className={styles.botaoF}>Cancelar</button> 
                </div>
                </>
                :  ''}
                   
                    
            </div>
        </div>
        <button  className={styles.botao} onClick={()=> onClose(false)}>fechar</button>
    </>)
}