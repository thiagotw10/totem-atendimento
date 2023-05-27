import styles from "@/styles/TelaGuiches.module.css";
import { BsDisplay } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { BsPersonPlus } from "react-icons/bs";
import { BsLaptop } from "react-icons/bs";
import { BsXCircleFill } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";
import PainelSenha from "./painelSenha";

export default function Guiches(){

    const [guiches, setGuiches] = useState([])
    const [painel, setPainel] = useState(false)
   

    useEffect(() => {
        if(painel == false){
                let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4NTE5NzY5NCwiZXhwIjoxNjg1MjAxMjk0fQ.ch-6jFDDFhUyZO9OZ8T4ps1ZNA5mv2bMbZqUwav69RY';
        
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
        
            axios.get('http://10.6.128.114:4000/guiche', config)
                .then((val) => {
                    console.log(val.data);
                    setGuiches(val.data.guiches);
                })
                .catch((error) => console.log(error));
        }
        
    }, [painel]);



    return (
    <>
    <div className={styles.menu}>
     <BsList className={styles.iconeAndroid}/>   
    </div>
    <div className={styles.container}>
        <div className={styles.menuVertical}>
            <div className={styles.listaMenus}>
                <div className={styles.caixaMenu}><BsDisplay className={styles.iconeTela}/></div>
                
            </div>
        </div>

        <div className={styles.conteudos}>
            {painel ? <PainelSenha dados={painel} onClose={setPainel}/> : 
                <><h4>Selecione o guichê para ir trabalhar</h4><div className={styles.cards}>

                            {guiches.map((val) => (
                                <div key={val.id} className={styles.card}>
                                    <BsXCircleFill className={styles.botaoFechar} />
                                    <div><BsLaptop className={styles.iconeTelaCard} /></div>
                                    <div><h4>Guichê: {val.numero_guiche}</h4></div>
                                    <div><button className={val.status == 'indisponivel' ? styles.botaoVermelho : styles.botao} onClick={()=> {setPainel(val)}}>{val.status}</button></div>
                                </div>
                            ))} 

                        </div></>
            }
            
        </div>
    </div>
    
         
    </>
    )
}