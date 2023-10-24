import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { PasswordInput } from "../../Components/Form/Inputs";
import { useState, useEffect } from "react";
import { validatePassword } from "../../lib/Validators";
import { useAuth } from "../../lib/context/AuthContext";
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
import { Button, Spinner } from "@nextui-org/react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdatedPassword, setIsUpdatedPassword] = useState(false);
  const { errors, setErrors, logout, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);
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
          querySnapshot.forEach((currentDoc) => {
            const docRef = doc(db, "users", currentDoc.id);
            updateDoc(docRef, { first_login: false })
              .then(() => {
                console.log("Document updated successfully");
                setIsUpdatedPassword(true);
              })
              .catch((error) => {
                console.log("Error updating document:", error);
              });
          });
        });
      })
      .catch((error) => {
        console.log("Error actualizar password:", error);
      });
    setErrors(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    logout();
    router.push("/auth/Login");
  };

  return (
    <div className="espacioD">
      <Head>
        <title>ACTUALIZAR CONTRASEÑA</title>
        <meta name="description" content="ACTUALIZAR CONTRASEÑA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <div className="container mx-auto p-10 justify-center items-center h-full">
        {!isUpdatedPassword ? (
          <>
            <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4">
              <h2 className="text-lg font-semibold mb-2 ">
                <p className="text-center">ACTUALIZAR CONTRASEÑA</p>
              </h2>
              <div className="flex justify-center items-center mb-5">
                <Image
                  src={"/icons/user-lock-solid.svg"}
                  height={70}
                  width={70}
                  alt="user lock icon"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  1. La contraseña debe tener al menos 8 caracteres
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  2. La contraseña debe contener al menos una letra minúscula
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  3. La contraseña debe contener al menos un número
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  4. La contraseña debe contener al menos un carácter especial
                </p>
              </div>
              <div className="column col-span-2 justify-center items-center ">
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-2">
                  <div className="sm:col-span-1">
                    <div className="mt-2 pr-4">
                      <PasswordInput
                        label={"Nueva contraseña"}
                        value={newPassword}
                        type="password"
                        setValue={setNewPassword}
                        errorMessage={errors ? errors[0] : ""}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <div className="mt-2 pl-4">
                      <PasswordInput
                        label={"Confirmar Contraseña"}
                        value={confirmNewPassword}
                        type="password"
                        setValue={setConfirmNewPassword}
                        errorMessage={errors ? errors[0] : ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="justify-center items-center content-center flex mt-5">
                  {loading && <Spinner />}
                </div>
                <div className="justify-center items-center content-center flex mt-5">
                  <div className="mt-2 pr-4">
                    <Button
                      size="lg"
                      color="primary"
                      onPress={handlePasswordUpdate}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
                <h2 className="text-lg font-semibold mb-10 ">
                  <p className="text-center">PERFIL ACTUALIZADO</p>
                </h2>
                <div className="flex justify-center items-center mb-10">
                  <Image
                    src={"/icons/user-lock-solid.svg"}
                    height={70}
                    width={70}
                    alt="user lock icon"
                  />
                </div>
                <div className="text-center">
                <p className="text-sm text-gray-600 mb-20">
                  Debido a que su contraseña fue actualizada es necesario que
                  inicie sesión nuevamente.
                </p>
                </div>
                <div className="justify-center items-center content-center flex mt-5">
                  <div className="mt-2 pr-4 mb-10">
                    <Button
                      size="lg"
                      color="primary"
                      onClick={handleLogout}
                      className="hover:bg-indigo-500"
                    >
                      Iniciar Sesión
                    </Button>
                  </div>
                </div>
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
