import styles from "@/styles/TelaGuiches.module.css";
import { useState, useEffect } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import axios from "axios";

export default function PainelSenha({dados, onClose}){
    const [senhas, setSenhas] = useState([]);
    const [senhaDetalhes, setSenhaDetalhes] = useState([]);

    useEffect(() => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4NTE2MjE2NiwiZXhwIjoxNjg1MTY1NzY2fQ.i5-xo6xKJShZwptaapg8exMvsZfLG2DZbAg72199RLs';
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        axios.get('http://192.168.0.107:4000/senha', config)
            .then((val) => {
                console.log(val.data);
                setSenhas(val.data.data);
            })
            .catch((error) => console.log(error));
    }, []);


    return(
    <>
        <h1>{dados}</h1>
        <div className={styles.painelSenhaContainer}>
            <div className={styles.painelSenhaCards}>
                {senhas.map((val)=>(
                    <div key={val.id} className={styles.painelSenhaCard} onClick={()=>{setSenhaDetalhes(val)}}>
                        <div style={{display: 'flex', alignItems: 'center'}}><BsFillCircleFill style={{marginRight: '20px', color: 'green'}}/><h2 style={{margin: '0'}}>SENHA: {val.senha}</h2></div>
                        <div><button disabled={val.status === 'indisponivel'} className={styles.botao}>{val.status === 'indisponivel' ? 'Em atendimento' : 'Chamar'}</button></div>
                    </div>
                ))}
            </div>
            <div className={styles.painelSenhaDetalhes}>
                {senhaDetalhes.senha ? <>
                 <div className={styles.painelSenhaTexto}>
                    <h1 style={{fontSize: '70px'}}>SENHA: {senhaDetalhes.senha}</h1>
                    <h3>Prioridade: {senhaDetalhes.prioridade}</h3>
                </div>

                <div className={styles.painelSenhaListaBotoes}>
                    <button className={styles.botao}>Chamar</button>
                    <button className={styles.botao}>Finalizar</button>
                    <button className={styles.botao}>Cancelar</button>
                </div>
                </>
                :  ''}
                   
                    
            </div>
        </div>
        <button  className={styles.botao} onClick={()=> onClose(false)}>fechar</button>
    </>)
}