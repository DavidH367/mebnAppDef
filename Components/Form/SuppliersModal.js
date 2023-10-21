import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
const supliersRef = collection(db, 'supliers_info');
const supliersRef2 = collection(db, 'supliers');

const SuppliersModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    //inicio de los estados que se van a manejar
    const [rtn, setRTN] = useState('');
    const [nombre, setNombre] = useState('');
    // Estado para manejar la validez del formulario
    const [formValid, setFormValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    //funcion para validar y guardar datos en FireStore
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar si los campos obligatorios están llenos
        if (!rtn || !nombre) {
            setFormValid(false);
            setErrorMessage('Por favor, complete todos los campos obligatorios.');
            return; // No enviar el formulario si falta algún campo obligatorio
        }
        try {
            // Realiza una consulta para verificar si ya existe un documento con el mismo "rtn"
        const querySnapshot = await getDocs(
            query(collection(db, 'supliers'), where('rtn', '==', rtn), limit(1)
        ));

        if (!querySnapshot.empty) {
            // Ya existe un registro con el mismo "rtn"
            setFormValid(false);
            alert('Ya existe un registro con el mismo RTN.');
        } else {
            // No se encontraron registros con el mismo "rtn," puedes continuar con la creación
            let code1;
            const querySnapshot2 = await getDocs(
                query(collection(db, 'supliers'), orderBy('code', 'desc'), limit(1)
            ));

            if (!querySnapshot2.empty) {
                querySnapshot2.forEach((doc) => {
                    code1 = doc.data().code + 1;
                });
            } else {
                code1 = 1; // Si no hay documentos anteriores, empezar desde 1
            }

            const newData = {
                code: code1,
                name: nombre.toUpperCase(),
                rtn: rtn,
            };

            const newData2 = {
                code: code1,
                name: nombre.toUpperCase(),
                rtn: rtn,
                capital: parseFloat(0),
                paid: parseFloat(0),
                pending: parseFloat(0),
            };

            await addDoc(supliersRef, newData);
            await addDoc(supliersRef2, newData2);

            // Limpiar los campos del formulario después de guardar
            setRTN('');
            setNombre('');

            alert('Registro Ingresado con Éxito');
        }
    }  catch (error) {
            console.error('Error al guardar los datos:', error);
        };

        // Reiniciar la validación y el mensaje de error
        setFormValid(true);
        setErrorMessage('');

    }

    return (
        <>
            <Link className='pointer' onPress={onOpen} color="primary">(Agregar Nuevo)</Link>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size={'5xl'}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Ingrese Nuevos Datos</ModalHeader>
                            <form onSubmit={handleSubmit} >
                                <ModalBody>

                                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">

                                        <div className="sm:col-span-1">
                                            <label htmlFor="rtn" className=" block text-sm font-medium leading-6 text-gray-900">
                                                <p className='font-bold text-lg'>
                                                    RTN
                                                </p>
                                            </label>
                                            <div className="mt-2 pr-4">
                                                <Input
                                                    isRequired
                                                    type="text"
                                                    label="RTN"
                                                    id="rtn"
                                                    value={rtn}
                                                    onChange={(e) => setRTN(e.target.value)}
                                                    className="max-w-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label htmlFor="nombre" className=" block text-sm font-medium leading-6 text-gray-900">
                                                <p className='font-bold text-lg'>
                                                    Nombre
                                                </p>
                                            </label>
                                            <div className="mt-2 pr-4">
                                                <Input
                                                    isRequired
                                                    type="text"
                                                    label="Nombre Completo"
                                                    id="nombre"
                                                    autoComplete="given-name"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    className="max-w-xs"
                                                />
                                            </div>
                                        </div>


                                    </div>


                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        type='submit' className='items-center w-40 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={onClose}
                                        className='items-center w-40 hover:bg-red-400'
                                    >
                                        Cerrar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}


export default SuppliersModal;