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
  // Two phases are:
  // 1: User enters email and request a email be sent for recovery
  // 2: Recovery email is sent and now the user needs their email
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
        <title>Recuperacion de contraseña</title>
        <meta name="description" content="recuperacion de contrasena" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/lccfavicon.ico" />
      </Head>
      <div className={styles.recoverMainContainer}>
        {/* request password */}
        {currentPhase === 0 ? (
          <section className={styles.recoverySections}>
            <Image
              src={"/lock-solid-question.svg"}
              width={170}
              height={170}
              alt="icono para recuperacion de contrasena"
            />
            <h1 className={styles.recoverTitle}>Recuperación de Contraseña</h1>
            <span className={styles.recoverSubtitle}>
              Para recuperar tu contraseña ingresa el correo electrónico
              asociado con tu cuenta.{" "}
            </span>
            <TextInput
              label="Correo Electrónico"
              type="text"
              value={email}
              setValue={setEmail}
              errorMessage={errors}
            />
            {loading && <Spinner color="primary" />}
            <div className="recovery-buttons-container">
              <Button
                color="secondary"
                size="lg"
                variant="bordered"
                onPress={handlePreviousPhase}
              >
                Regresar
              </Button>
              <Button size="lg" color="primary" onPress={sendResetEmail}>
                Siguiente
              </Button>
            </div>
          </section>
        ) : null}
        {currentPhase === 1 ? (
          <Card className="psswrd-recovery-container">
            <Image
              src={"/envelope-open-email.svg"}
              width={170}
              height={170}
              alt="icono para recuperacion de contrasena"
            />
            <h1 className={styles.recoverTitle}>
              Revise su Correo Electrónico
            </h1>
            <span className={styles.recoverSubtitle}>
              Sigue las instrucciones enviadas al correo <b>{email}</b> para
              reiniciar tu contraseña. Al terminar, intenta iniciar sesion
              nuevamente.
            </span>
            <div className="recovery-buttons-container">
              <Button
                onClick={handlePreviousPhase}
                variant="bordered"
                color="secondary"
                size="lg"
              >
                Regresar
              </Button>
              <Button
                color="primary"
                size="lg"
                onClick={() => {
                  router.push("/auth/Login");
                }}
              >
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
