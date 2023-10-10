import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { PasswordInput } from "../../Components/Form/Inputs";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../Components/Form/Buttons";
import styles from "../../styles/Login.module.css";
import { validatePassword } from "../../lib/Validators";
import { useAuth } from "../../lib/context/AuthContext";
import Title from "../../Components/Form/Title";
import { updatePassword } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "@firebase/firestore";
import { db, auth } from "../../lib/firebase";
import {
  Button,
  Container,
  Grid,
  Loading,
  Spinner,
  Text,
} from "@nextui-org/react";
const ResetPasswordd = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdatedPassword, setIsUpdatedPassword] = useState(false);
  const { errors, setErrors, logout, user } = useAuth();
  const router = useRouter();
  //validate password strength
  const handlePasswordUpdate = async (e) => {
    setLoading(true);
    const newErrors = validatePassword(newPassword);
    if (newPassword !== confirmNewPassword) {
      setLoading(false);
      const newError = ["Las contraseñas no coinciden"];
      setErrors(newError);
      return;
    }
    if (newErrors.length) {
      setErrors(newErrors);
      setLoading(false);
      console.log(newErrors);
      return;
    }
    const user = auth.currentUser;
    updatePassword(user, newPassword)
      .then(() => {
        console.log("Password updated successfully");
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("uid", "==", user.uid));
        getDocs(q).then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("No documents found");
            return;
          }
        });
      })
      .catch((error) => {
        console.log("Error updating password:", error);
      });
    setErrors(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    logout();
    router.push("/auth/Login");
  };
  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="recuperacion de contraseña" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/lccFavIcon.ico" />
      </Head>
      {!isUpdatedPassword ? (
        <>
          <div className="flex flex-col justify-center items-center">
            <Image
              src={"/icons/user-lock-solid.svg"}
              height={70}
              width={70}
              alt="user lock icon"
            />
            <Title>¿Primera vez iniciando sesión?</Title>
            <p>
              Por motivos de seguridad requerimos que cambies tu contraseña.
            </p>
            <p>Requerimientos de nueva contraseña:</p>
            <ul className="decorated-list">
              <li>La contraseña debe tener al menos 8 caracteres</li>
              <li>La contraseña debe contener al menos una letra minúscula</li>
              <li>La contraseña debe contener al menos un número</li>
              <li>La contraseña debe contener al menos un carácter especial</li>
            </ul>
          </div>
          <div className="form-container">
            <PasswordInput
              label={"Nueva contraseña"}
              value={newPassword}
              type="password"
              setValue={setNewPassword}
              errorMessage={errors ? errors[0] : ""}
            />
            <PasswordInput
              label={"Confirme su nueva contraseña"}
              value={confirmNewPassword}
              type="password"
              setValue={setConfirmNewPassword}
              errorMessage={errors ? errors[0] : ""}
            />
            {loading && <Spinner />}
          </div>
          <div className="recovery-buttons-container">
            <Button
              size="lg"
              variant="bordered"
              color="secondary"
              onPress={handleLogout}
            >
              Regresar
            </Button>
            <Button size="lg" color="primary" onPress={handlePasswordUpdate}>
              Confirmar
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="centered-container">
            <div className={styles.introContainer}>
              <Image
                src={"/icons/arrows-rotate-solid.svg"}
                height={70}
                width={70}
                alt="update profile icon"
              />
              <Title>Perfil Actualizado</Title>
              <p>
                Debido a que su contraseña fue actualizada es necesario que
                inicie sesión nuevamente.
              </p>
              <PrimaryButton text={"Iniciar sesión"} onClick={handleLogout} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPasswordd;
