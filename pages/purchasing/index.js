import React, { useState, useEffect } from "react";
import Head from "next/head";
import "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { zonas, tipoC, columns } from "../../Data/purchasing/datas";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import { imgData } from "../../Data/svg_data/svg_logoData";

const purchasesRef = collection(db, "purchases");

const Purchasing1 = () => {
  //datos para factura
  //usos de datos
  const [rtn, setRTN] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [zona, setZona] = useState("");
  const [tipoCafe, setTipoCafe] = useState("");
  const [precio, setPrecio] = useState("");
  const [quintales, setQuintales] = useState("");
  const [peso, setPeso] = useState("");
  //inicio para el filtro de datos

  //estado para formulario
  const [guardando, setGuardando] = useState(false); // Estado para controlar el botón

  // Estado para manejar la validez del formulario
  const [formValid, setFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  //fin del filtro
  //Valida acceso a la pagina
  const router = useRouter();
  const { user, errors, setErrors } = useAuth();
  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);
  // Función para guardar datos
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!guardando) {
      setGuardando(true);

      // Verificar si los campos obligatorios están llenos
      if (
        !nombre ||
        !apellido ||
        !zona ||
        !tipoCafe ||
        !quintales ||
        !peso ||
        !precio
      ) {
        setFormValid(false);
        setErrorMessage("Por favor, complete todos los campos obligatorios.");
        return; // No enviar el formulario si falta algún campo obligatorio
      }
      try {
        // Obtener el último valor de "n_transaction"
        const querySnapshot1 = await getDocs(
          query(
            collection(db, "purchases"),
            orderBy("n_transaction", "desc"),
            limit(1)
          )
        );

        let numTrans;
        if (!querySnapshot1.empty) {
          querySnapshot1.forEach((doc) => {
            numTrans = doc.data().n_transaction + 1;
          });
        } else {
          numTrans = 1; // Si no hay documentos anteriores, empezar desde 1
        }

        const rtnValue = rtn || "Consumidor Final";
        // Incrementar el valor de "n_transaction" para el nuevo documento

        //obtener peso neto:
        let pNeto;
        pNeto = peso * 100 - quintales;
        pNeto = pNeto / 100;

        const newData = {
          rtn: rtnValue,
          name: nombre,
          last_name: apellido,
          zone: zona,
          coffee_type: tipoCafe,
          bags: parseFloat(quintales),
          weight: parseFloat(peso),
          weightN: parseFloat(pNeto.toFixed(2)),
          total: parseFloat(precio),
          date: new Date(), // Guardar la fecha actual en Firebase
          n_transaction: numTrans,
        };

        await addDoc(purchasesRef, newData);

        // Obtener los datos recién guardados desde Firestore
        const querySnapshot = await getDocs(
          query(collection(db, "purchases"), orderBy("date", "desc"))
        );
        const purchaseData4 = [];
        let indexs = 1;
        querySnapshot.forEach((doc) => {
          purchaseData4.push({ ...doc.data(), indexs: indexs++ });
        });
        const fecha = new Date(newData.date);

        // Obtener la fecha en formato dd/mm/aaaa
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1
          }/${fecha.getFullYear()}`;

        // Obtener la hora en formato hh:mm:ss
        const horaFormateada = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;

        const fechaYHora = `${fechaFormateada}, ${horaFormateada}`;
        // Limpiar los campos del formulario después de guardar
        setRTN("");
        setNombre("");
        setApellido("");
        setZona("");
        setTipoCafe("");
        setPrecio("");
        setQuintales("");
        setPeso("");

        //addlogo

        //PDF
        const doc = new jsPDF({ unit: "mm", format: [215, 140] });
        doc.addImage(imgData, "PNG", 3, 3, 27, 27);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("BODEGA - GAD", 50, 10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Compra Venta de Café", 53, 15);
        doc.setFontSize(8);
        doc.text("RTN: 03131985004693", 56, 19);
        doc.setFontSize(10);
        doc.text("Telefono: (504) 9541-9092 - (504) 9860-9162", 35, 24);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("COMPROBANTE DE COMPRA", 46, 31);
        doc.text(`Fecha: ${fechaYHora}`, 4, 38);
        doc.text(`N° de Factura: ${newData.n_transaction}`, 97, 38);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`RTN: ${newData.rtn}`, 4, 45);
        doc.text(`Nombre Cliente: ${newData.name}, ${newData.last_name}`, 4, 52);
        doc.text(`Zona: ${newData.zone}`, 97, 52);
        doc.setFont("helvetica", "bold");
        doc.text(`Sacos de Producto: ${newData.bags}`, 4, 59);
        doc.text(`Tipo de Café: ${newData.coffee_type}`, 4, 66);
        doc.text(`Peso Bruto: ${newData.weight} Quintales`, 4, 73);
        doc.text(`Peso Neto: ${newData.weightN} Quintales`, 4, 80);
        doc.text(`TOTAL FACTURADO: ${parseFloat(newData.total).toLocaleString("es-ES", {
          style: "currency",
          currency: "HNL",
          minimumFractionDigits: 2,
        })}`, 79, 80);
        doc.text("¡GRACIAS POR TU PREFERENCIA!", 40, 87);
        // Agregar una nueva página
        doc.addPage();
        //PDF
        doc.setFontSize(16);
        doc.addImage(imgData, "PNG", 3, 3, 27, 27);
        doc.setFont("helvetica", "bold");
        doc.text("BODEGA - GAD", 50, 10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Compra Venta de Café", 53, 15);
        doc.setFontSize(8);
        doc.text("RTN: 03131985004693", 56, 19);
        doc.setFontSize(10);
        doc.text("Telefono: (504) 9860-9162 - (504) 9541-9092 ", 35, 24);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("COMPROBANTE DE COMPRA (Copia de Cliente)", 28, 31);
        doc.text(`Fecha: ${fechaYHora}`, 5, 38);
        doc.text(`N° de Factura: ${newData.n_transaction}`, 95, 38);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`RTN: ${newData.rtn}`, 5, 45);
        doc.text(`Nombre Cliente: ${newData.name}, ${newData.last_name}`, 5, 52);
        doc.text(`Zona: ${newData.zone}`, 95, 52);
        doc.setFont("helvetica", "bold");
        doc.text(`Sacos de Producto: ${newData.bags}`, 5, 59);
        doc.text(`Tipo de Café: ${newData.coffee_type}`, 5, 66);
        doc.text(`Peso Bruto: ${newData.weight} Lbs`, 5, 73);
        doc.text(`Peso Neto: ${newData.weightN} Lbs`, 5, 80);
        doc.text(`TOTAL FACTURADO: ${parseFloat(newData.total).toLocaleString("es-ES", {
          style: "currency",
          currency: "HNL",
          minimumFractionDigits: 2,
        })}`, 79, 80);
        doc.text("¡GRACIAS POR TU PREFERENCIA!", 40, 87);

        //guardar el PDF con un identificador
        // Set the document to automatically print via JS
        doc.autoPrint();
        doc.output("dataurlnewwindow");

        // Recargar la página
        window.location.reload();
      } catch (error) {
        console.error("Error al guardar los datos:", error);
      } finally {
        // Vuelve a habilitar el botón después del guardado (independientemente de si tuvo éxito o no)
        setGuardando(false);
      }
    }
    // Reiniciar la validación y el mensaje de error
    setFormValid(true);
    setErrorMessage("");
  };

  return (
    <div className="espacio">
      <Head>
        <title>INGRESO DE COMPRAS</title>
        <meta name="description" content="INGRESO DE COMPRAS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <div className="container mx-auto p-10 justify-center items-center">
        <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
          <h2 className="text-lg font-semibold mb-2 ">
            <p className="text-center">INGRESO DE COMPRAS</p>
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="sm:col-span-1">
                <label
                  htmlFor="rtn"
                  className=" block text-sm font-medium leading-6 text-gray-900"
                >
                  <p className="font-bold text-lg ">RTN</p>
                </label>
                <div className="mt-2 pr-4">
                  <Input
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
                <label
                  htmlFor="nombre"
                  className=" block text-sm font-medium leading-6 text-gray-900"
                >
                  <p className="font-bold text-lg">Nombre</p>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="Ej: David"
                    id="nombre"
                    autoComplete="given-name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Apellido</a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="Ej: Hernández"
                    id="apellido"
                    autoComplete="family-name"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="zona"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Ubicación</a>
                </label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Select
                    isRequired
                    id="zona"
                    label="Zona"
                    placeholder="Seleccione una Zona"
                    autoComplete="zona"
                    className="max-w-xs"
                    onChange={(e) => setZona(e.target.value)}
                  >
                    {zonas.map((zona) => (
                      <SelectItem key={zona.value} value={zona.value}>
                        {zona.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="sm:col-span-1 ">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  <a className="font-bold text-lg">Tipo de Café</a>
                </label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Select
                    isRequired
                    id="tipoCafe"
                    label="Tipo Cáfe"
                    placeholder="Seleccione Tipo de Café"
                    autoComplete="tipoCafe"
                    onChange={(e) => setTipoCafe(e.target.value)}
                    className="max-w-xs"
                  >
                    {tipoC.map((tipoCafe) => (
                      <SelectItem key={tipoCafe.value} value={tipoCafe.value}>
                        {tipoCafe.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="quintales"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Sacos</a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="number"
                    label="Uds"
                    step="0.01"
                    id="quintales"
                    autoComplete="quintales"
                    value={quintales}
                    onChange={(e) => setQuintales(e.target.value)}
                    className="max-w-xs"
                    min={0.01}
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="peso"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Peso Quintales</a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="number"
                    label="Lbs"
                    step="0.01"
                    id="peso"
                    autoComplete="peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="max-w-xs"
                    min={0.01}
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="precio"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Valor en (Lempiras)</a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="number"
                    label="L"
                    step="0.01"
                    id="precio"
                    autoComplete="precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="max-w-xs"
                    min={1}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="h-9 w-40 mt-11 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Purchasing1;
