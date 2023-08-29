import { useRouter } from "next/router";
import {useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";
import Head from "next/head";
import { Card, Link, Spinner, Image } from "@nextui-org/react";
import { PrimaryButton } from "../../Components/Form/Buttons";
import { EmailInput, PasswordInput } from "../../Components/Form/Inputs";
import { ValidateEmail } from "../../lib/Validators";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    //const {login, errors, setErrors, user } = useAuth();
    const router = useRouter();
    const loginUser = async () =>{
        setErrors("")
        setLoading(true)
        //validate email
        if (!ValidateEmail(email)){
            setErrors("Correo electrónico no válido")
            setLoading(false)
            return
        }
        const userLogin = await login(email, password)
        if (!userLogin){
            setLoading(false)
            return
        } 
    }
return (
    <div>
        <Head>
            <title>Café</title>
            <meta name="description" content="inicio de sesión" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            {/* <link rel="icon" href="" /> */}
        </Head>
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
            }}>
            <Card 
                isBlurred
                style={{padding: "45px 45px 45px 45px"}}>
                <div className={styles.loginLogo}>
                    <Image
                        width={110}
                        height={100}
                        alt="NextUI hero Image with delay"
                        src="/img/perfil.jpg"
                    />
                </div>
                <h1 style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px",padding: "10px"}}>Inicio de Sesión</h1>
                <div className="w-60">
                    <div>
                        <EmailInput
                            label="Correo Electrónico"
                            value={email}
                            type="email"
                            setValue={setEmail}
                            className="login-input"/>
                    </div>
                    <div>
                        <PasswordInput
                            label="Contraseña"
                            value={password}
                            type="password"
                            setValue={setPassword}
                            className={"login-input"}/>
                    </div>
                    
                    
                </div>
            </Card>
            <div className={styles.loginButtonContainer}>
                {/* {loading && <Spinner type="points-opacity" style={{ margin: "20px" }} />}
                {errors && <span className="form-errors">{errors}</span>} */}
                <PrimaryButton
                    text="Iniciar Sesión"
                    // onClick={loginUser}
                    className={styles.btnLogin}/>
                <p className={styles.passwordSubtitle}>
                    {/* ¿Olvidaste tu Contraseña? */}
                    <Link href="#" className={styles.lblRecoverPassword}>
                        Recupérar Contraseña
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
}

export default Login;   