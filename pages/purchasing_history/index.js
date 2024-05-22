import Head from "next/head";

import ReusableTable from "../../Components/Form/ReusableTable";
import FilterSection from "../../Components/Form/FilterSectionP";
import React, { useState, useEffect } from "react";
import { parse, isAfter, isBefore } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../lib/context/AuthContext";
import Estados from "@/Components/Form/statsC";
import { CalendarDate, parseDate } from "@internationalized/date";
import {parseZonedDateTime, parseAbsoluteToLocal} from "@internationalized/date";
import {DateValue, now} from "@internationalized/date";

import FirebaseFirestore from 'firebase/app';
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
import { Input, Select, SelectItem, Textarea, DatePicker, Divider } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/router";
import { imgData } from "../../Data/svg_data/svg_logoData";

const nlpReference = collection(db, "ministries");

const ConsultasClientes = () => {
  //datos para factura
  //usos de datos
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [logo_url, setLogo_url] = useState("");
  const [ministry_name, setMinistry_name] = useState("");
  const [mision, setMision] = useState("");
  const [vision, setVision] = useState("");
  const [start_year, setStart_year] = React.useState(parseDate("2024-04-04"));


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


  const handleFilterChange = (key, value) => {
    setFecha_nacimiento((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  // Función para guardar datos
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!guardando) {
      setGuardando(true);

      // Verificar si los campos obligatorios están llenos
      if (
        !category ||
        !description ||
        !ministry_name ||
        !mision ||
        !vision ||
        !start_year 
      ) {
        setFormValid(false);
        setErrorMessage("Por favor, complete todos los campos obligatorios.");
        return; // No enviar el formulario si falta algún campo obligatorio
      }
      try {
             
        const newData = {
          category: category,
          description: description,
          ministry_name: ministry_name,
          mision: mision,
          vision: vision,
          start_year: new Date(start_year),
       
        };

        await addDoc(nlpReference, newData);

      
        // Limpiar los campos del formulario después de guardar
        setCategory("");
        setDescription("");
        setMinistry_name("");
        setMision("");
        setVision("");
        setStart_year("");
  
        //addlogo

        //PDF
        /*
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
        doc.setFont("helvetica", "italic");
        doc.text("'Dios Bendiga los Frutos de tus Labores.'", 32, 87);
        doc.setFont("helvetica", "normal");
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
        doc.setFont("helvetica", "italic");
        doc.text("'Dios Bendiga los Frutos de tus Labores.'", 32, 87);
        doc.setFont("helvetica", "normal");

        //guardar el PDF con un identificador
        // Set the document to automatically print via JS
        doc.autoPrint();
        doc.output("dataurlnewwindow");

        // Recargar la página
        */
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
        <title>NUEVO PROYECTO</title>
        <meta name="description" content="INGRESO DE ALUMNOS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <div className="container mx-auto p-10 justify-center items-center">
        <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
          <h2 className="text-lg font-semibold mb-2 ">
            <p className="text-center">DATOS GENERALES DEL PROYECTO</p>
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="sm:col-span-1">
                <label
                  className=" block text-sm font-medium leading-6 text-gray-900"
                >
                  <p className="font-bold text-lg ">CATEGORIA</p>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="Tipo"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="Descripcion"
                  className=" block text-sm font-medium leading-6 text-gray-900"
                >
                  <p className="font-bold text-lg">DESCRIPCION</p>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="Descript."
                    id="description"
                    autoComplete="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Nombre de Proyecto</a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="Ej: New Life Project"
                    id="ministry_name"
                    autoComplete="Name"
                    value={ministry_name}
                    onChange={(e) => setMinistry_name(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="Mision"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">MISION</a>
                </label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Textarea
                    isRequired
                    id="mision"
                    placeholder="Ej. "
                    autoComplete="mision"
                    className="max-w-xs"
                    value={mision}
                    onChange={(e) => setMision(e.target.value)}
                  >

                  </Textarea>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="Vision"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">VISION</a>
                </label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Textarea
                    isRequired
                    id="vision"
                    placeholder="Ej. "
                    autoComplete="vision"
                    className="max-w-xs"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                  >

                  </Textarea>
                </div>
              </div>

              <div className="sm:col-span-1 ">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  <a className="font-bold text-lg">Fecha de Inicio</a>
                </label>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <DatePicker
                    id="start_year"
                    label="Fecha de Inicio"
                    variant="bordered"
                    showMonthAndYearPickers
                    granularity="day"
                    defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
                    value={start_year}
                    onChange={setStart_year}
                    placeholderText="Fecha de inicio"
                    dateFormat="dd/MM/yyyy"
                  />

                </div>
              </div>

            </div>
            <Divider className="my-4" />
            <h2 className="text-lg font-semibold mb-2 ">
              <p className="text-center">DATOS GRAFICOS DE LOS PROYECTOS</p>
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS
            </p>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="sm:col-span-1">
                <label
                  htmlFor="precio"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">LOGO</a>
                </label>
                <div className="mt-2 pr-4">
                  


                </div>
              </div>



              <div className="sm:col-span-1">
                <label
                  htmlFor="precio"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">IMAGENES PRINCIPALES</a>
                </label>
                <div className="mt-2 pr-4">
                  



                </div>
              </div>

              <button
              onSubmit={handleSubmit}
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

export default ConsultasClientes;
