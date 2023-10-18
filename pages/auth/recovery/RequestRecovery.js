import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { TextInput } from "../../../Components/Form/Inputs";
import { ValidateEmail } from "../../../lib/Validators";
import { useAuth } from "../../../lib/context/AuthContext";
import styles from "../../../styles/Login.module.css";
import { Button, Card, Spinner } from "@nextui-org/react";
const RequestRecovery = () => {
  const [email, setEmail] = useState("");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(false);
  const { forgotPassword, errors, setErrors } = useAuth();
  const router = useRouter();
  const handleNextPhase = () => {
    setLoading(false);
    setCurrentPhase(currentPhase < 2 ? currentPhase + 1 : currentPhase);
  };
  const handlePreviousPhase = () => {
    setLoading(false);
    if (currentPhase === 0) {
      router.push("/auth/Login");
    }
    setCurrentPhase(currentPhase > 0 ? currentPhase - 1 : currentPhase);
  };
  const sendResetEmail = async () => {
    //validate email
    setErrors("");
    setLoading(true);
    if (!ValidateEmail(email)) {
      setErrors("Correo electrónico no válido");
      setLoading(false);
      return;
    }
    const sendForgotPassword = await forgotPassword(email);
    if (!sendForgotPassword) {
      setLoading(false);
      return;
    }
    handleNextPhase();
  };
  return (
    <div>
      <Head>
        <title>Recuperacion de Contraseña</title>
        <meta name="description" content="recuperacion de contrasena" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/" />
      </Head>
      <div className={styles.recoverMainContainer}>
        {/* request password */}
        {currentPhase === 0 ? (
          <Card className={styles.recoverySections}>
            <h1 className="text-lg font-semibold mb-10 mt-3">
              <p className="text-center">RECUPERACIÓN DE CONTRASEÑA</p>
            </h1>
            <Image
              src={"/icons/email.png"}
              width={120}
              height={120}
              alt="icono para recuperacion de contrasena"
            />
            <span className="text-default-500 font-bold my-5">
              Para recuperar tu contraseña ingresa el correo electrónico
              asociado con tu cuenta.{" "}
            </span>
            <div className="w-[80%]">
              <TextInput
                label="Correo Electrónico"
                type="text"
                value={email}
                setValue={setEmail}
                errorMessage={errors}
              />  
            </div>
            {loading && <Spinner color="primary" />}
            <div className="mb-3">
              <div className="mb-3 mt-4">
                <Button
                  color="danger"
                  size="lg"
                  onPress={handlePreviousPhase}>
                  Regresar
                </Button>
              </div>
              <div>
                <Button size="lg" color="primary" onPress={sendResetEmail}>
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
        {currentPhase === 1 ? (
          <Card className={styles.recoverySections}>
            <h1 className="text-lg font-semibold mb-10  mt-3">
            <p className="text-center">REVISE SU CORREO ELECTRÓNICO</p>
          </h1>
            <Image
              src={"/icons/recover.svg"}
              width={120}
              height={120}
              alt="icono para recuperacion de contrasena"
            />
            <div className="text-center my-5">
              <span className="text-default-500 font-bold"> 
                Sigue las instrucciones enviadas al correo <b>{email}</b> para
                reiniciar tu contraseña. Al terminar, intenta iniciar sesion
                nuevamente.
              </span>
            </div>
            <div className="mt-3 mb-3">
              <Button
                color="primary"
                size="lg"
                onClick={() => {
                  router.push("/auth/Login");
                }}>
                Iniciar sesión
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default RequestRecovery;
