import Head from "next/head";
import { useRouter } from "next/router";
import { TextInput, TelephoneInput } from "../../Components/Form/Inputs";
import { SingleComboBox } from "../../Components/Form/ComboBoxes";
import Title from "../../Components/Form/Title";
import { PrimaryButton, SecondaryButton } from "../../Components/Form/Buttons";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/context/AuthContext";
import {
  validateCellphone,
  ValidateEmail,
  validateString,
} from "../../lib/Validators";

import { db } from "../../lib/firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
const UserRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("ADMINISTRADOR");
  const [userState, setUserState] = useState("ACTIVO");
  const [loading, setLoading] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  const { user, errors, setErrors } = useAuth();
  // useEffect(() => {
  //   if (!user) {
  //     setErrors("");
  //     router.push("/auth/Login");
  //   } else if (localUser.role != "ADMINISTRADOR") {
  //     setErrors("");
  //     router.push("/");
  //   }
  // }, []);

  const handleCreateUser = async () => {
    setLoading(true);
    setErrors({});
    //validate inputs
    // To improve UX, a custom message will be displayed for each validation
    // Code is used to identify the input
    if (firstName === "") {
      setLoading(false);
      setErrors({ code: 1, message: "El nombre no puede estar vacío" });
      return;
    }
    if (!validateString(firstName)) {
      setLoading(false);
      setErrors({ code: 1, message: "Solo se aceptan letras y espacios" });
      return;
    }
    if (lastName === "") {
      setLoading(false);
      setErrors({ code: 2, message: "El apellido no puede estar vacío" });
      return;
    }
    if (!validateString(lastName)) {
      setLoading(false);
      setErrors({ code: 2, message: "Solo se aceptan letras y espacios" });
      return;
    }
    if (phoneNumber === "") {
      setLoading(false);
      setErrors({ code: 3, message: "Este campo no puede estar vacío" });
      return;
    }
    if (!validateCellphone(phoneNumber)) {
      setLoading(false);
      setErrors({
        code: 3,
        message: "El número debe tener al menos 8 dígitos",
      });
      return;
    }
    if (email === "") {
      setLoading(false);
      setErrors({
        code: 4,
        message: "Este campo no puede estar vacío",
      });
      return;
    }
    if (!ValidateEmail(email)) {
      setLoading(false);
      setErrors({
        code: 4,
        message: "Formato de correo eléctronico no válido",
      });
      return;
    }
    if (userRole === "") {
      setLoading(false);
      setErrors({
        code: 5,
        message: "Seleccione una universidad",
      });
      return;
    }
    else {
      setErrors({});
    }
    //create user - authentication
    const userData = {
      email: email,
      displayName: `${firstName.toUpperCase()} ${lastName.toUpperCase()}`,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      cellphone: phoneNumber,
      role: userRole,
      state: userState,
      adminRegister: user.uid,
    };

    try {
      const res = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log("Response from server:", await res.text());
      if (res.ok) {
        setErrors({});
        router.push("/users/UserList?status=1");
      } else {
        const errorData = await res.json();
        if (errorData.code === "auth/email-already-exists") {
          // -1 code is used for internal errors
          setErrors({
            code: -1,
            message: "Correo electrónico ya esta en uso",
          });
          setLoading(false);
        }
      }
    } catch (error) {
      if (errors !== -1) {
        setLoading(false);
        router.push("/users/UserList?status=0");
        console.error("An error occurred:", error);
      }
    }
  };
  const handleReturn = () => {
    setErrors({});
    router.push("/users/UserList");
  };
  return (
    <div>
      <Head>
        <title>Registro de Usuario | Liga Contra el Cancér</title>
        <meta name="description" content="pagina de registro de usuarios" />
      </Head>
      <div className="form-container">
        <Title>Registro de Usuario</Title>
        <TextInput
          label="Nombres"
          value={firstName}
          setValue={setFirstName}
          type="text"
          isRequired={true}
          errorMessage={errors.code === 1 ? errors.message : ""}
        />
        <TextInput
          label="Apellidos"
          value={lastName}
          setValue={setLastName}
          placeholder="Hernandez Castillo"
          type="text"
          isRequired={true}
          errorMessage={errors.code === 2 ? errors.message : ""}
        />
        <TelephoneInput
          label="Número de Celular"
          value={phoneNumber}
          setValue={setPhoneNumber}
          isRequired={true}
          errorMessage={errors.code === 3 ? errors.message : ""}
        />
        <TextInput
          label={"Correo Electrónico"}
          value={email}
          setValue={setEmail}
          isRequired={true}
          type="email"
          errorMessage={errors.code === 4 ? errors.message : ""}
        />
        <div className="combo-box-containers">
          <SingleComboBox
            label={"Rol de Usuario"}
            value={userRole}
            setValue={setUserRole}
            options={[
              "ADMINISTRADOR",
              "AUXILIAR"
            ]}
            errorMessage={errors.code === 5 ? errors.message : ""}
          />
          <SingleComboBox
            label={"Estado de Usuario"}
            value={userState}
            setValue={setUserState}
            options={["ACTIVO", "INACTIVO"]}
          />
        </div>
      </div>
      {/* Error messages */}
      {/* Internal errors */}
      {errors ? (
        <p className="form-errors text-center">
          {errors.code <= 0 ? errors.message : ""}
        </p>
      ) : null}

      {/* Reminder to check for errors */}
      {errors.message ? (
        <p className="form-errors text-center">Por favor revise los campos.</p>
      ) : null}
      <div className="buttons-container">
        <SecondaryButton
          text={"Regresar"}
          onClick={handleReturn}
          isLoading={loading}
        />
        <PrimaryButton
          text={"Guardar"}
          onClick={handleCreateUser}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default UserRegister;
