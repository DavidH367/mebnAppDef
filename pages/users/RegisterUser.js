import React, { useState, useEffect } from "react";
import Head from "next/head";
import "firebase/firestore";
import { Input, Chip } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/context/AuthContext";
import addNewUser from "../../lib/firebase/firebaseNewUser";
import { registrerWithEmail } from "../../lib/firebase/firebaseAuth";
import {
  validateCellphone,
  ValidateEmail,
  validateString,
} from "../../lib/Validators";

const UserRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("ADMINISTRADOR");
  const [userState, setUserState] = useState("ACTIVO");
  const router = useRouter();
  const { user, logout, errors, setErrors } = useAuth();
  const upReference = collection(db, "updates");

  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    const logoutUser = await logout();
    if (logoutUser) {
      router.push("/auth/Login");
      return;
    }
  };
  const handleSubmit = async () => {
    if (firstName === "") {
      setErrors("El nombre no puede estar vacío");
      return;
    }
    if (!validateString(firstName)) {
      setErrors("Nombre incorrecto");
      return;
    }
    if (lastName === "") {
      setErrors("El apellido no puede estar vacío");
      return;
    }
    if (!validateString(lastName)) {
      setErrors("Apellido incorrecto");
      return;
    }
    if (phoneNumber === "") {
      setErrors("El número de teléfono no puede estar vacío");
      return;
    }
    if (!validateCellphone(phoneNumber)) {
      setErrors("Número de teléfono incorrecto");
      return;
    }
    if (email === "") {
      setErrors("El correo electrónico no puede estar vacío");
      return;
    }
    if (!ValidateEmail(email)) {
      setErrors("Correo electrónico incorrecto");
      return;
    }
    const password = "MEBN2024!";
    const { user, error } = await registrerWithEmail(email, password);
    if (error != null) {
      console.log("error", error);
      alert("error: ", error);
    } else {
      await addNewUser(
        user,
        firstName,
        lastName,
        phoneNumber,
        userRole,
        userState
      );
      const newUpData = {
        action: "Se Creo un Nuevo Usuario",
        date: new Date(),
        uid: user.uid,
      };
      await addDoc(upReference, newUpData);

      handleLogout();
    }
  };
  return (
    <div className="espacioU">
      <Head>
        <title>REGISTRO DE USUARIOS</title>
        <meta name="description" content="REGISTRO DE USUARIOS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <div className="container mx-auto p-10 justify-center items-center h-full">
        <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
          <h2 className="text-lg font-semibold mb-2 ">
            <p className="text-center">REGISTRO DE USUARIOS</p>
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS
          </p>

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="sm:col-span-1">
              <label
                htmlFor="nombre"
                className=" block text-sm font-medium leading-6 text-gray-900"
              >
                <p className="font-bold text-lg">Nombre</p>
              </label>
              <div className="mt-2 pr-4">
                <Input
                  isRequired
                  label="Ej: David"
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="apellido"
                className=" block text-sm font-medium leading-6 text-gray-900"
              >
                <p className="font-bold text-lg">Apellido</p>
              </label>
              <div className="mt-2 pr-4">
                <Input
                  isRequired
                  label="Ej: Hernández"
                  type="text"
                  name="apellido"
                  id="apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="telefono"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                <a className="font-bold text-lg">Numero de teléfono</a>
              </label>
              <div className="mt-2 pr-4">
                <Input
                  isRequired
                  label="Ej: 96365214"
                  type="numeric"
                  name="telefono"
                  id="telefono"
                  value={phoneNumber
                    .replace(/[^0-9]/g, "")
                    .replace(/(\d{4})(\d{4})/, "$1-$2")
                    .slice(0, 9)}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                <a className="font-bold text-lg">Correo Electrónico</a>
              </label>
              <div className="mt-2 pr-4">
                <Input
                  isRequired
                  label="Ej: <EMAIL>"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>
            <div className="sm:col-span-1 mt-5">
              {errors ? (
                <Chip color="warning" variant="flat" className="mb-3">
                  <span className="form-errors">{errors}</span>
                </Chip>
              ) : null}
              <div>
                <button
                  onClick={handleSubmit}
                  className="h-9 w-40 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
