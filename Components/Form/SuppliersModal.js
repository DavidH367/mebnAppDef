import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
const supliersRef = collection(db, 'supliers_info');

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
            // Obtener el último valor de "code"
            const querySnapshot2 = await getDocs(
                query(collection(db, 'supliers'), orderBy('code', 'desc'), limit(1)));

            let code1;
            if (!querySnapshot2.empty) {
                querySnapshot2.forEach((doc) => {
                    code1 = doc.data().code + 1;
                });
            } else {
                code1 = 1; // Si no hay documentos anteriores, empezar desde 1
            }

            const newData = {
                code: code1,
                name: nombre,
                rtn: rtn,
            };

            await addDoc(supliersRef, newData)

            // Limpiar los campos del formulario después de guardar
            setRTN('');
            setNombre('');


            // Guarda el PDF en una ubicación accesible

            alert('Registro Ingresado con Exito');
        } catch (error) {
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
                            <ModalBody>
                                <form onSubmit={handleSubmit} >
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

                                        <Button
                                            type='submit' className='h-9 w-40 mt-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                </form>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}


export default SuppliersModal;