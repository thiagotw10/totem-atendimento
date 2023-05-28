import styles from "@/styles/TelaGuiches.module.css";
import { useState, useEffect } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import axios from "axios";
import { io } from 'socket.io-client'
import acessToken from "../api/token";

export default function Senhas(){

    const [senhas, setSenhas] = useState([]);
    const [socket, setSocket] = useState(null);
    const [atualizacao, setAtualizacao] = useState('');


    useEffect(() => {
        let token = acessToken();
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.get('http://192.168.0.107:4000/historico', config)
            .then((val) => {
                setSenhas(val.data.historico);  
            })
            .catch((error) => console.log(error));
    }, [atualizacao]);

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

    return (<>
        <div className={styles.painelSenhas}>
            <div className={styles.painelSenhaCards}>
                <h1 style={{textAlign: 'center'}}>Fique de olho aqui na tela, sua senha vai ser chamada aqui</h1>
                <h3 style={{textAlign: 'center'}}>Ultimas senhas chamadas</h3>
                {senhas.length === 0 ? (
                    <p style={{textAlign: 'center'}}>Não há atendimento disponível no momento.</p>
                    ) : (
                    senhas.map((val, index) => (
                        <div key={val.senha} className={index === 0 ? styles.blink : styles.painelSenhaCard}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <BsFillCircleFill style={{ marginRight: '20px', color: 'green' }} />
                            <h2 style={{ margin: '0' }}>SENHA: {val.senha}</h2>
                        </div>
                        <div>
                            <h2 style={{ margin: '0' }}>GUICHÊ: {val.guiche}</h2>                 
                            <p style={{ margin: '0' }}>Data: {converteData(val.data_hora)}</p>                    
                        </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </>)
}