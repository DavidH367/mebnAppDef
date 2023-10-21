import React, { useState, useEffect } from "react";
import "firebase/firestore";
import { db } from "../../lib/firebase";
import {
    addDoc,
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    where
} from "firebase/firestore";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import { Input, Select, SelectItem } from "@nextui-org/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

const supliersInfoRef = collection(db, "supliers_info");

const Reportes = () => {
    //Valida acceso a la pagina
    const router = useRouter();
    const { user, errors, setErrors } = useAuth();
    useEffect(() => {
        if (!user) {
            setErrors("");
            router.push("/auth/Login");
        }
    }, []);
    const [valorFechas, setValorFechas] = useState({
        startDate: null,
        endDate: null,
    });

    //select con proveedores
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Estado para manejar la validez del formulario
    const [formValid, setFormValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const querySnapshot = await getDocs(supliersInfoRef);

                const supplierData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    supplierData.push({
                        id: doc.id,
                        code: data.code,
                        name: data.name,
                        rtn: data.rtn,
                    });
                });
                setSuppliers(supplierData);
            } catch (error) {
                console.error("Error fetching suppliers from Firestore:", error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleCambioFechas = (key, value) => {
        setValorFechas((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    function handleProvidier(event) {
        const selectedSupplierValue = event.target.value;

        // Actualiza el estado con el nuevo valor seleccionado
        setSelectedSupplier(selectedSupplierValue);

    }

    const clearData = () => {
        setValorFechas({
            startDate: null,
            endDate: null,
        });

    };

    // Función para guardar datos
    const handleSubmit = async (event) => {
        const idDocumentos = selectedSupplier;
        event.preventDefault();

        // Verificar si los campos obligatorios están llenos
        if ({}) {

            try {

                let auxCode;
                const docId2 = idDocumentos;
                //obbtener codigo
                const docRef3 = doc(db, 'supliers_info', docId2); // Crear una referencia al documento específico

                const docSnapshot2 = await getDoc(docRef3); // Obtener el snapshot del documento
                if (docSnapshot2.exists()) {
                    // El documento existe, puedes acceder al valor de rtn
                    auxCode = docSnapshot2.data().code;
                } else {
                    // El documento no existe
                    console.log('El documento no existe.');
                }

                //obtener nombre
                let auxName;
                const docRef2 = doc(db, 'supliers_info', docId2); // Crear una referencia al documento específico
                const docSnapshot1 = await getDoc(docRef2); // Obtener el snapshot del documento
                if (docSnapshot1.exists()) {
                    // El documento existe, puedes acceder al valor de rtn
                    auxName = docSnapshot1.data().name;
                } else {
                    // El documento no existe
                    console.log('El documento no existe.');
                }

                //obtener RTN
                let auxRtn;
                const docRef = doc(db, 'supliers_info', docId2); // Crear una referencia al documento específico
                const docSnapshot = await getDoc(docRef); // Obtener el snapshot del documento
                if (docSnapshot.exists()) {
                    // El documento existe, puedes acceder al valor de rtn
                    auxRtn = docSnapshot.data().rtn;
                } else {
                    // El documento no existe
                    console.log('El documento no existe.');
                }

                const querySnapshot = await getDocs(
                    query(
                        collection(db, 'supliers_history'),
                        where('rtn', '==', auxRtn),
                        where('date', '>=', valorFechas.startDate), // Filtrar por fecha de inicio
                        where('date', '<=', valorFechas.endDate), // Filtrar por fecha de fin 
                        orderBy('date', 'desc')
                    )
                );

                //suma total de ingresos
                const querySnapshot2 = await getDocs(
                    query(
                        collection(db, "supliers_history"),
                        where("rtn", "==", auxRtn),
                        where("status", "==", "Ingreso de Capital")
                    )
                );
                let latestIngresos = 0;
                querySnapshot2.forEach((doc) => {
                    const dataI = doc.data();
                    // Asegúrate de que la propiedad 'capital' exista en el documento
                    if (dataI.hasOwnProperty("capital")) {
                        latestIngresos += dataI.capital; // Suma el valor de 'value' al total
                    }
                });

                const querySnapshot3 = await getDocs(
                    query(
                        collection(db, "supliers_history"),
                        where("rtn", "==", auxRtn),
                        where("status", "==", "Abono a Capital")
                    )
                );

                let latestEgresos = 0;
                querySnapshot3.forEach((doc) => {
                    const dataI = doc.data();
                    // Asegúrate de que la propiedad 'capital' exista en el documento
                    if (dataI.hasOwnProperty("capital")) {
                        latestEgresos += dataI.capital; // Suma el valor de 'value' al total
                    }
                });

                //traer datos en JSON
                let datosProvidiers = [];
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        datosProvidiers.push(doc.data());

                    });
                } else {
                    console.log("No se pudo traer los datos de esta consulta"); // Si no hay documentos anteriores.
                }

                const doc1 = new jsPDF({ orientation: "landscape" });
                doc1.text(`Pendiente: ${parseFloat(latestIngresos).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "HNL",
                    minimumFractionDigits: 2,
                })}`, 220, 25);
                doc1.text(`Abonado: ${parseFloat(latestEgresos).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "HNL",
                    minimumFractionDigits: 2,
                })}`, 220, 35);
                // Definir las columnas, ancho de columna y posición inicial
                const columns = ["Fecha", "Capital", "Cheque/$", "N° Documento", "Transacción"];
                const columnWidth = 40;
                let x = 15;
                let y = 30;

                // Función para agregar los encabezados de columna

                function addPageHeader() {
                    doc1.setFontSize(14);
                    doc1.setFont("helvetica", "bold");
                    doc1.text("REPORTE DE TRANSACCIONES:", 15, 15);
                    doc1.text(`${auxName}`, 110, 15);
                    doc1.text(`RTN: ${auxRtn}`, 220, 15);

                }
                function addColumnHeaders() {
                    columns.forEach((column, index) => {
                        const columnX = x + index * columnWidth;
                        doc1.rect(columnX, y, columnWidth, 10);
                        doc1.text(column, columnX + columnWidth / 2, y + 5, { align: "center", valign: "middle" });
                    });
                }

                function addNewPage() {
                    doc1.addPage({ format: "a4", orientation: "landscape" });
                    addPageHeader(); // Agrega el encabezado en cada nueva página
                    addColumnHeaders();
                    // Establecer el tamaño de la fuente para los datos
                    doc1.setFontSize(10);
                    doc1.setFont("helvetica", "normal");
                    y = 30;
                    recordCount = 0; // Reinicia el contador de registros en cada nueva página
                }

                // Inicializar un contador para realizar un seguimiento de los registros
                let recordCount = 0;
                // Agrega la primera página y encabezado
                addPageHeader(); // Agrega el encabezado en cada nueva página
                addColumnHeaders();
                doc1.setFontSize(10);
                doc1.setFont("helvetica", "normal");
                // Ajusta el valor de desplazamiento en el eje X (horizontal)
                const offsetX = 20; // Cambia este valor según tus necesidades

                // Recorrer los datos obtenidos de Firestore
                datosProvidiers.forEach((data, dataIndex) => {
                    if (recordCount >= 15) {
                        // Agrega una nueva página cuando alcanzas 16 registros
                        addNewPage();
                    }

                    const rowX = 15 + offsetX;
                    const rowY = 30 + (recordCount + 1) * 10;
                    const rowWidth = columns.length * columnWidth;
                    const rowHeight = 10;

                    // Dibujar un rectángulo alrededor de la fila
                    doc1.rect(rowX - 20, rowY, rowWidth, rowHeight);

                    // Formatear los datos en un arreglo según el orden de las columnas
                    const rowData = [
                        data.date
                            ? format(data.date.toDate(), "dd/MM/yyyy")
                            : "",
                        data.capital
                            ? parseFloat(data.capital).toLocaleString("es-ES", {
                                style: "currency",
                                currency: "HNL",
                                minimumFractionDigits: 2,
                            })
                            : "",
                        data.n_check ? String(data.n_check) : "",
                        data.n_document ? String(data.n_document) : "",
                        data.status ? String(data.status) : "",
                    ];

                    // Agregar los datos al reporte
                    rowData.forEach((value, columnIndex) => {
                        doc1.text(String(value), rowX + columnIndex * columnWidth, rowY + rowHeight / 2, { align: "center", valign: "middle" });
                    });

                    recordCount++;
                });

                // Guardar o mostrar el documento PDF, por ejemplo, descargarlo
                doc1.autoPrint();
                doc1.output("dataurlnewwindow");

                setSelectedSupplier('');
                setValorFechas({
                    startDate: null,
                    endDate: null,
                });

            } catch (error) {
                console.error("Error al traer los datos:", error);
            }

            setFormValid(false);
            setErrorMessage("Por favor, complete todos los campos obligatorios.");
            return; // No enviar el formulario si falta algún campo obligatorio
        }
        // Reiniciar la validación y el mensaje de error
        setFormValid(true);
        setErrorMessage("");
    };

    return (<>
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 sm:text-center md:text-center lg:text-center">
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">INFORMES GENERALES</p>
            </div>
            <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
                <p className="text-sm text-gray-600 mb-6">
                    MODULO DE INFORMES - POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="sm:col-span-1">
                            <label htmlFor="proveedor" className="block text-sm font-medium leading-6 text-gray-900">
                                <a className='font-bold text-lg'>
                                    PROVEEDOR
                                </a>
                            </label>
                            <div className="mt-2 pr-4">
                                <Select
                                    items={suppliers}
                                    isRequired
                                    label="INFORME DE:"
                                    placeholder="Selecciona un Proveedor"
                                    className="max-w-xs"
                                    value={selectedSupplier}
                                    onChange={handleProvidier}
                                >
                                    {(user) => (
                                        <SelectItem key={user.id} textValue={user.name}>
                                            <div className="flex gap-2 items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-small">{user.name}</span>
                                                    <span className="text-tiny text-default-400">RTN: {user.rtn}</span>
                                                    <span className="text-tiny text-default-400">Codigo: {user.code}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                            </div>

                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="fecha_inicial" className="block text-sm font-medium leading-6 text-gray-900">
                                <a className='font-bold text-lg'>
                                    Fecha Inicial
                                </a>
                            </label>
                            <div className="mt-2 pr-4">
                                <DatePicker
                                    selected={valorFechas.startDate}
                                    onChange={(date) => handleCambioFechas("startDate", date)}
                                    placeholderText="Fecha de inicio"
                                    dateFormat="dd/MM/yyyy"
                                    className="border rounded px-4 py-4 mr-2"
                                />
                            </div>

                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="fecha_final" className="block text-sm font-medium leading-6 text-gray-900">
                                <a className='font-bold text-lg'>
                                    Fecha Final
                                </a>
                            </label>
                            <div className="mt-2 pr-4">
                                <DatePicker
                                    selected={valorFechas.endDate}
                                    onChange={(date) => handleCambioFechas("endDate", date)}
                                    placeholderText="Fecha de fin"
                                    dateFormat="dd/MM/yyyy"
                                    className="border rounded px-4 py-4 mr-2"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            color="primary"
                            variant="shadow"
                            className="btn btn-secondary ml-2"                        >
                            GENERAR
                        </Button>
                        <Button
                            color="primary"
                            variant="shadow"
                            onClick={clearData}
                            className="btn btn-secondary ml-2"
                        >
                            LIMPIAR
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </>);
}

export default Reportes;