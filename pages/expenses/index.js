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
  where,
} from "firebase/firestore";
import { useAuth } from "../../lib/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { columns, tipoGasto } from "../../Data/expenses/data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Button } from "@nextui-org/react";
import { jsPDF } from "jspdf";
const expensesRef = collection(db, "expenses");

const Gastos = () => {
  // Estado para manejar la validez del formulario
  const [formValid, setFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //Valida acceso a la pagina
  const router = useRouter();
  const { user, errors, setErrors } = useAuth();
  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);

  const [coments, setComents] = useState("");
  const [denomination, setDenomination] = useState("");
  const [description, setDescription] = useState("");
  const [n_document, setN_document] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");

  // Función para guardar datos
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si los campos obligatorios están llenos
    if (!type || !denomination || !description || !n_document || !value) {
      setFormValid(false);
      setErrorMessage("Por favor, complete todos los campos obligatorios.");
      return; // No enviar el formulario si falta algún campo obligatorio
    }
    try {
      const newData = {
        coments: coments,
        date: new Date(),
        denomination: denomination,
        description: description,
        n_document: n_document,
        type: type,
        value: parseFloat(value),
      };
      await addDoc(expensesRef, newData);

      // Limpiar los campos del formulario después de guardar
      setComents("");
      setDenomination("");
      setDescription("");
      setN_document("");
      setType("");
      setValue("");

      alert("Datos guardados con exito.");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }

    // Reiniciar la validación y el mensaje de error
    setFormValid(true);
    setErrorMessage("");
  };

  //Seccion para el Reporte de Gastos
  const [valorFechas, setValorFechas] = useState({
    startDate: null,
    endDate: null,
  });

  const handleCambioFechas = (key, value) => {
    setValorFechas((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const clearData = () => {
    setValorFechas({
      startDate: null,
      endDate: null,
    });
  };

  // Función para guardar datos
  const handleSubmitG = async (event) => {
    event.preventDefault();
    if (valorFechas.startDate === null || valorFechas.endDate === null) {
        return;
    }

    // Verificar si los campos obligatorios están llenos
    if ({}) {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "expenses"),
            where("date", ">=", valorFechas.startDate), // Filtrar por fecha de inicio
            where("date", "<=", valorFechas.endDate), // Filtrar por fecha de fin
            orderBy("date", "desc")
          )
        );

        //suma total de gastos
        const querySnapshot2 = await getDocs(
          query(
            collection(db, "expenses"),
            where("date", ">=", valorFechas.startDate), // Filtrar por fecha de inicio
            where("date", "<=", valorFechas.endDate), // Filtrar por fecha de fin
            orderBy("date", "desc")
          )
        );
        let latestGastos = 0;
        querySnapshot2.forEach((doc) => {
          const dataI = doc.data();
          // Asegúrate de que la propiedad 'capital' exista en el documento
          if (dataI.hasOwnProperty("value")) {
            latestGastos += dataI.value; // Suma el valor de 'value' al total
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
        doc1.text(
          `Total Gastos: ${parseFloat(latestGastos).toLocaleString("es-ES", {
            style: "currency",
            currency: "HNL",
            minimumFractionDigits: 2,
          })}`,
          145,
          15
        );
        let pagina = 1;
        doc1.text(`${pagina}`, 280, 210);
        // Definir las columnas, ancho de columna y posición inicial
        const columns = [
          "Fecha",
          "Tipo",
          "Denominación",
          "Descripción",
          "N° Factura",
          "Valor",
        ];
        const columnWidth = 45;
        let x = 15;
        let y = 30;

        // Función para agregar los encabezados de columna

        function addPageHeader() {
          doc1.setFontSize(14);
          doc1.setFont("helvetica", "bold");
          doc1.text("REPORTE DE GASTOS:", 15, 15);
          doc1.text("BODEGA - GAD", 90, 15);
        }
        function addColumnHeaders() {
          columns.forEach((column, index) => {
            const columnX = x + index * columnWidth;
            doc1.rect(columnX, y, columnWidth, 10);
            doc1.text(column, columnX + columnWidth / 2, y + 5, {
              align: "center",
              valign: "middle",
            });
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
          pagina++;
          doc1.text(`${pagina}`, 280, 210);
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
            data.date ? format(data.date.toDate(), "dd/MM/yyyy") : "",
            data.type ? String(data.type) : "",
            data.denomination ? String(data.denomination) : "",
            data.description ? String(data.description) : "",
            data.n_document ? String(data.n_document) : "",
            data.value
              ? parseFloat(data.value).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "HNL",
                  minimumFractionDigits: 2,
                })
              : "",
          ];

          // Agregar los datos al reporte
          rowData.forEach((value, columnIndex) => {
            doc1.text(
              String(value),
              rowX + columnIndex * columnWidth,
              rowY + rowHeight / 2,
              { align: "center", valign: "middle" }
            );
          });

          recordCount++;
        });

        // Guardar o mostrar el documento PDF, por ejemplo, descargarlo
        doc1.save("reporte.pdf");
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

  return (
    <>
      <div className="espacio">
        <div className="container mx-auto p-10 justify-center items-center h-full">
          <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
            <h2 className="text-lg font-semibold mb-2 ">
              <p className="text-center">INGRESO DE GASTOS</p>
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              LLENAR TODOS LOS CAMPOS NECESARIOS
            </p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="sm:col-span-1 ">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    <a className="font-bold text-lg">TIPO DE GASTO</a>
                  </label>
                  <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <Select
                      isRequired
                      id="type"
                      label="Seleccione tipo de Gasto: "
                      autoComplete="type"
                      onChange={(e) => setType(e.target.value)}
                      className="max-w-xs"
                    >
                      {tipoGasto.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="denomination"
                    className=" block text-sm font-medium leading-6 text-gray-900"
                  >
                    <p className="font-bold text-lg">DENOMINACION</p>
                  </label>
                  <div className="mt-2 pr-4">
                    <Input
                      isRequired
                      type="text"
                      label="Ej: David H"
                      id="denomination"
                      autoComplete="given-name"
                      value={denomination}
                      onChange={(e) => setDenomination(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    <a className="font-bold text-lg">DESCRIPCION</a>
                  </label>
                  <div className="mt-2 pr-4">
                    <Input
                      isRequired
                      type="text"
                      label="Ej: Trabajo en Planta"
                      id="description"
                      autoComplete="family-name"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="n_document"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    <a className="font-bold text-lg">FACTURA</a>
                  </label>
                  <div className="mt-2 pr-4">
                    <Input
                      isRequired
                      type="text"
                      label="N° Factura"
                      id="n_document"
                      autoComplete="family-name"
                      value={n_document}
                      onChange={(e) => setN_document(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="value"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    <a className="font-bold text-lg">VALOR</a>
                  </label>
                  <div className="mt-2 pr-4">
                    <Input
                      isRequired
                      type="number"
                      label="Lempiras"
                      step="0.01"
                      id="value"
                      autoComplete="value"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="max-w-xs"
                      min={0.01}
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="coments"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    <a className="font-bold text-lg">COMENTARIOS</a>
                  </label>
                  <div className="mt-2 pr-4">
                    <Textarea
                      type="text"
                      label="Ej: Quedo pendiente"
                      id="coments"
                      autoComplete="family-name"
                      value={coments}
                      onChange={(e) => setComents(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="h-9 w-40 mt-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white py-10">
            <h2 className="text-lg font-semibold mb-2 ">
            <p className='text-center'>
                INFORME DE GASTOS
            </p>
          </h2>
            <div className="px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 ">
              <p className="text-sm text-gray-600 mb-6">
                LLENAR TODOS LOS CAMPOS NECESARIOS
              </p>
              <form onSubmit={handleSubmitG}>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="fecha_inicial"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      <a className="font-bold text-lg">Fecha Inicial</a>
                    </label>
                    <div className="mt-2 pr-4">
                      <DatePicker
                        selected={valorFechas.startDate}
                        onChange={(date) =>
                          handleCambioFechas("startDate", date)
                        }
                        placeholderText="Fecha de inicio"
                        dateFormat="dd/MM/yyyy"
                        className="border rounded px-4 py-4 mr-2"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="fecha_final"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      <a className="font-bold text-lg">Fecha Final</a>
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
                    className="btn btn-secondary ml-2"
                  >
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
        </div>
      </div>
    </>
  );
};

export default Gastos;
