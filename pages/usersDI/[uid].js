import { db } from "../../lib/firebase";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  onSnapshot,
} from "@firebase/firestore";
import Head from "next/head";
import { TextInput, TelephoneInput } from "../../Components/Form/Inputs";
import { SingleComboBox } from "../../Components/Form/ComboBoxes";
import { PrimaryButton, SecondaryButton } from "../../Components/Form/Buttons";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/context/AuthContext";
import {
  validateCellphone,
  ValidateEmail,
  validateString,
} from "../../lib/Validators";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
const UserDetails = ({ userData }) => {
  //form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userState, setUserState] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { user, setErrors, errors } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // if (!user) {
    //   setErrors("");
    //   router.push("/auth/Login");
    // } else if (localUser.role != "ADMINISTRADOR") {
    //   setErrors("");
    //   router.push("/");
    // }
    const usersCollection = collection(db, "users");
    const q = query(
      usersCollection,
      where("user_code", "==", userData.user_code)
    );

    // Listen for real-time updates on the query
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const newUserData = { id: doc.id, ...doc.data() };

        setFirstName(newUserData.firstName);
        setLastName(newUserData.lastName);
        setPhoneNumber(newUserData.cellphone);
        setEmail(newUserData.email);
        setUserRole(newUserData.user_role);
        setUserState(newUserData.user_state);
      }
    });
    // Return the unsubscribe function to be called when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  const handleUpdateUser = async () => {
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
    if (validateCellphone(phoneNumber)) {
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
    else {
      setErrors({});
    }
    //update user - authentication
    const updateFields = {
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      email: email,
      cellphone: phoneNumber,
      user_role: userRole,
      user_state: userState,
    };
    //update user
    const docRef = doc(db, "users", userData.id);
    try {
      //update in firebase authentication
      const res = await fetch("/api/changeEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          newEmail: email,
        }),
      });
      if (res.ok) {
        await updateDoc(docRef, updateFields);
        setLoading(false);
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
    } catch (e) {
      if (errors !== -1) {
        setLoading(false);
        router.push("/users/UserList?status=0");
        console.error("An error occurred:", e);
      }
    }
  };

  //delete user -TODO: TEST THIS
  const handleDeleteUser = async () => {
    setLoading(true);
    if (!userData.id) {
      setErrors({
        code: -1,
        message:
          "No se ha reconocido el usuario. Salga del formulario y seleccione al usuario",
      });
      console.log(`Tried to delete user with an ID of: ${userData.id}`);
      setLoading(false);
      return;
    }
    const userID = userData.id;
    try {
      const response = await fetch("/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID }), // Pass the user's UID to delete
      });

      if (response.ok) {
        setLoading(false);
        setErrors({});
        router.push("/users/UserList?status=1");
        return;
      } else {
        // -1 code is used for internal errors
        setErrors({
          code: -1,
          message: "No se ha podido eliminar al usuario. Intente nuevamente",
        });
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setErrors({});
      console.log(error);
      router.push("/users/UserList?status=0");
    }
  };
  const handleReturn = () => {
    setErrors({});
    router.push("/users/UserList");
  };

  return (
    <div>
      <Head>
        <title>Edición de Usuarios | Liga Contra el Cancér</title>
        <meta name="description" content="pagina de edicion de los usuarios" />
      </Head>
      <div className="form-container">
        <h1 className="text-center">Edición de Usuarios</h1>
        {/* MODAL SECTION */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          aria-labelledby="logout modal"
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex justify-center items-center">
                  <h3>¿Está seguro que quiere eliminar al usuario?</h3>
                  <b>Detalles del usuario</b>
                  <ul>
                    <li>Email: {userData.email}</li>
                    <li>
                      Nombre: {userData.firstName} {userData.lastName}
                    </li>
                    <li>Rol: {userData.user_role}</li>
                    <li>Universidad: {userData.hospital}</li>
                    <li>
                      {userData.campaign.campaignName
                        ? `Campaña: ${userData.campaign.campaignName}`
                        : ""}
                    </li>
                  </ul>
                  <p className="form-errors">
                    Esta acción eliminará al usuario permanentemente
                  </p>
                  {errors.code === -1 ? (
                    <p className="form-errors">{errors.message}</p>
                  ) : null}
                </ModalBody>
                <ModalFooter justify="center">
                  <Button color="default" onPress={onClose} isLoading={loading}>
                    Regresar
                  </Button>
                  <Button
                    color="danger"
                    isLoading={loading}
                    onPress={handleDeleteUser}
                  >
                    Eliminar usuario
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

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
          type="email"
          isRequired={true}
          errorMessage={errors.code === 4 ? errors.message : ""}
        />
        <div className="combo-box-containers">
          <SingleComboBox
            label={"Rol de Usuario"}
            value={userRole}
            setValue={setUserRole}
            options={[
              "ADMINISTRADOR",
              "AUXILIAR",
            ]}
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
          text="Actualizar"
          onClick={handleUpdateUser}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

//setting up paths
export async function getStaticPaths() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const data = querySnapshot.docs.map((item) => item.data());

  const paths = data.map((user) => {
    return {
      params: { uid: user.user_code },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}
//getting user information
export async function getStaticProps({ params }) {
  const usersCollection = collection(db, "users");
  const q = query(
    usersCollection,
    where("user_code", "==", params.uid.toString())
  );
  const querySnapshot = await getDocs(q);

  let userData = null;
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    userData = { id: doc.id, ...doc.data() };
  }
  return {
    props: {
      userData,
    },
    revalidate: 1,
  };
}
export default UserDetails;
