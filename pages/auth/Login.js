import { useRouter } from "next/router";
import {useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";
import Head from "next/head";
import { Card, Link, Spinner, Image, Chip } from "@nextui-org/react";
import { PrimaryButton } from "../../Components/Form/Buttons";
import { useAuth } from "../../lib/context/AuthContext";
import { EmailInput, PasswordInput } from "../../Components/Form/Inputs";
import { ValidateEmail } from "../../lib/Validators";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const {login, errors, setErrors, user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    });
    const loginUser = async () =>{
        setErrors("")
        setLoading(true)
        //Validar email
        if (!ValidateEmail(email)){
            setErrors({ code: 1, message: "Correo electrónico no válido" });
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
            <title>Bodega-Gad</title>
            <meta name="description" content="inicio de sesión"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/img/logo_paginas.png"/>
        </Head>
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "95vh",
            }}>
            <Card 
                style={{padding: "45px 45px 45px 45px"}}>
                <div className={styles.loginLogo}>
                    <Image
                        width={180}
                        height={180}
                        alt="NextUI hero Image with delay"
                        src="/img/logo_principal.png"
                    />
                </div>
                <h1 style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px",padding: "10px"}}>Inicio de Sesión</h1>
                <div className="w-60">
                    <div style={{marginBottom:"20px"}}>
                        <EmailInput
                            label="Correo Electrónico"
                            value={email}
                            type="email"
                            setValue={setEmail}
                            className="login-input"
                            errorMessage={errors.code === 1 ? errors.message : ""}
                        />
                    </div>
                    <div>
                        <PasswordInput
                            label="Contraseña"
                            value={password}
                            type="password"
                            setValue={setPassword}
                            className={"login-input"}
                            errorMessage={errors.code === 2 ? errors.message : ""}
                        />
                    </div>
                    
                    
                </div>
            </Card>
            <div className={styles.loginButtonContainer}>
                {loading && <Spinner label="Iniciando sesión..." color="primary" />}
                {errors.code === 3 && (
                    <Chip color="danger" className="mb-3">
                        <span className="form-errors">
                        {errors.code === 3 ? errors.message : ""}
                        </span>
                    </Chip>
                )}
                <PrimaryButton
                    text="Iniciar Sesión"
                    onClick={loginUser}
                    className={styles.btnLogin}/>
                <p className={styles.passwordSubtitle}>
                    {/* ¿Olvidaste tu Contraseña? */}
                    <Link href="/auth/recovery/RequestRecovery" className={styles.lblRecoverPassword}>
                        Recuperar Contraseña
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
}

export default Login;   