import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRouter } from "next/router";
import { useAuth } from "../../lib/context/AuthContext";
import addNewUser from "../../lib/firebase/firebaseNewUser";
import {registrerWithEmail} from "../../lib/firebase/firebaseAuth";

const UserRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("ADMINISTRADOR");
  const [userState, setUserState] = useState("ACTIVO");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { user, errors, setErrors } = useAuth();
// useEffect(() => {
//    if (!user) {
//      setErrors("");
//     router.push("/auth/Login");
//    } else if (localUser.role != "ADMINISTRADOR") {
//      setErrors("");
//      router.push("/");
//    }
//  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const DataNew = {
        email: email,
        displayName: `${firstName.toUpperCase()} ${lastName.toUpperCase()}`,
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        cellphone: phoneNumber,
        user_role: userRole,
        user_state: userState,
        adminRegister: user.uid,
    };
    
    await addDoc(collection(db, 'users'), DataNew)
      .then(() => {
        // Limpiar los campos del formulario después de guardar
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setUserRole('');
        setUserState('');
        fetchUsers();
      })
      .catch((error) => {
        console.error('Error al guardar los datos:', error);
      });
  }
  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className=" container mx-auto p-6 justify-center items-center h-screen ">
      <h1 className="text-2xl font-semibold mb-4 " >
        <p className='text-center'>
            USUARIOS
        </p>
      </h1>

    <div className='px-8 '>
      <div className="bg-white shadow rounded p-4 box-border h-400 w-800 p-2 border-4 ">

        <div>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="sm:col-span-1">
                <label htmlFor="nombre" className=" block text-sm font-medium leading-6 text-gray-900">
                  <p className='font-bold text-lg'>
                    Nombre
                  </p>
                </label>
                <div className="mt-2 pr-4">
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="apellido" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    Apellido
                  </a>
                </label>
                <div className="mt-2 pr-4">
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="fecha" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    Numero de telefono
                  </a>
                </label>
                <div className="mt-2 pr-4 ">
                    <input
                        type="numeric"
                        name="telefono"
                        id="telefono"
                        autoComplete="family-name"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="fecha" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    Email
                  </a>
                </label>
                <div className="mt-2 pr-4 ">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="family-name"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
              </div>
              <button 
                onClick={async ()=> { 
                      const password = "CAFE2023!";
                      const {user, error} = await registrerWithEmail(email, password)                    
                      if(error != null){
                          console.log('error', error)
                          alert('error: ', error)
                      }else{  
                          await addNewUser(user, firstName, lastName, phoneNumber, email, userRole, userState)
                      } 
                  }}
                className='h-9 w-40 mt-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
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