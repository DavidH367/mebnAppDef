import Head from "next/head";
import MenuOption from "../../Components/Home/MenuOption";
import Title from '../../Components/Form/Title'
import styles from "../../styles/Home.module.css"
import { useEffect } from "react";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
const UsersHome = () => {
    const {user,setErrors} = useAuth()
    const localUser = JSON.parse(localStorage.getItem('user'))
    const router = useRouter()
    // useEffect(()=>{
    //     if (!user){
    //         setErrors("")
    //         router.push("/auth/Login")
    //     }
    //     if (localUser.role != "ADMINISTRADOR"){
    //         setErrors("")
    //         router.push("/")
    //     }
    // })
    return (
        <div className={styles.homeContainer}>
            <Head>
                <title>Usuarios | Liga Contra el Cancér</title>
                <meta name="description" content="pagina de inicio de los usuarios" />
            </Head>
            <Title>Usuarios</Title>
            <section className={styles.optionsWrapper}>
                <div className={styles.menuOptionsRow}>
                    <MenuOption
                        optionIcon={"/IMG/NewUser.svg"}
                        optionTitle="Nuevo Usuario"
                        optionLink={"/users/UserRegister"}/>
                    <MenuOption
                        optionIcon={"/IMG/lista.svg"}
                        optionTitle={"Lista de Usuarios"}
                        optionLink={"/users/UserList"}/>
                </div>
            </section>
        </div>
    );
}

export default UsersHome;