import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { columns, tipoC } from './datas';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { jsPDF } from "jspdf";

const salesRef = collection(db, 'sales');
const invRef = collection(db, 'inventories');

const MainComponent = () => {

  //usos de datos
  const [sales, fetchSales] = useState([]);
  const [transaccion, setTransaccion] = useState('');
  const [rtn, setRTN] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoCafe, setTipoCafe] = useState('');
  const [quintales, setQuintales] = useState('');
  const [peso, setPeso] = useState('');
  const [precio, setPrecio] = useState('');


  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Estado para manejar la validez del formulario
  const [formValid, setFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "sales"), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      const salesData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        salesData.push({ ...doc.data(), Sales_id: doc.id, indexs: indexs++ });
      });
      setData(salesData);
      setFilteredData(salesData); // Inicializa los datos filtrados con los datos originales
    };

    fetchData();
  }, []);


  // Función para aplicar el filtro
  const applyFilter = (value) => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  //Funcion para guardar datos
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si los campos obligatorios están llenos
    if (!nombre || !tipoCafe || !quintales || !precio || !peso) {
      setFormValid(false);
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
      return; // No enviar el formulario si falta algún campo obligatorio
    }




    try {
      // Obtener el último valor de "n_transaction"
      const querySnapshot1 = await getDocs(
        query(collection(db, 'inventories'), orderBy('n_transaction', 'desc'), limit(1)));
      //obtener el ultimo valor de balance
      const querySnapshot2 = await getDocs(
        query(collection(db, 'inventories'), orderBy('n_transaction', 'desc'), limit(1)));

      //asignar el nuevo valor de numero transaccion
      let numTrans;

      if (!querySnapshot1.empty) {
        querySnapshot1.forEach((doc) => {
          numTrans = doc.data().n_transaction + 1;
        });
      } else {
        numTrans = 1; // Si no hay documentos anteriores, empezar desde 1
      }

      //asignar el nuevo valor de balance
      let newBalance2;

      if (!querySnapshot2.empty) {
        querySnapshot2.forEach((doc) => {
          newBalance2 = doc.data().balance + parseFloat(precio);
        });
      } else {
        newBalance2 = 1; // Si no hay documentos anteriores, empezar desde 1
      }
      const rtnValue = rtn || "CF";

      const newData = {
        rtn: rtnValue,
        name: nombre,
        date: new Date(), // Guardar la fecha actual en Firebase
        type: tipoCafe,
        bags_sold: parseFloat(quintales),
        weight: parseFloat(peso),
        total: parseFloat(precio),
        n_transaction: numTrans,
      };

      const newInvData = {
        rtn: rtnValue,
        tran_type: 'VENTA',
        coffee_type: tipoCafe,
        value: parseFloat(precio),
        weight: parseFloat(peso),
        date: new Date(), // Guardar la fecha actual en Firebase
        n_transaction: numTrans,
        balance: newBalance2,
      };


      await addDoc(salesRef, newData)

      await addDoc(invRef, newInvData)

      const fecha = new Date(newData.date);
      // Obtener la fecha en formato dd/mm/aaaa
      const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      // Obtener la hora en formato hh:mm:ss
      const horaFormateada = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
      const fechaYHora = `${fechaFormateada}, ${horaFormateada}`;

      //PDF
      const doc = new jsPDF({ unit: 'mm', format: [215, 140] });
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('BODEGA - GAD', 50, 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Compra Venta de Café', 53, 15);
      doc.setFontSize(8);
      doc.text('RTN: 0313198500469', 58, 19);
      doc.setFontSize(10);
      doc.text('Telefono: (504) 9541-9092', 50, 24);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Fecha: ${fechaYHora}`, 5, 35);
      doc.text(`N° de Factura: ${newData.n_transaction}`, 95, 35);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`RTN: ${newData.rtn}`, 5, 45);
      doc.text(`Nombre Cliente: ${newData.name}`, 5, 52);
      doc.setFont('helvetica', 'bold');
      doc.text(`Quintales en Unidades: ${newData.bags_sold}`, 5, 59);
      doc.text(`Tipo de Café: ${newData.type}`, 5, 66);
      doc.text(`Peso Neto en Libras: ${newData.weight}`, 5, 73);
      doc.text(`TOTAL FACTURADO: ${newData.total} L`, 80, 73);
      doc.text('¡GRACIAS POR TU PREFERENCIA!', 40, 85);
      //guardar el PDF con un identificador
      // Set the document to automatically print via JS
      doc.autoPrint();
      doc.output('dataurlnewwindow');


      // Limpiar los campos del formulario después de guardar
      setRTN('');
      setNombre('');
      setQuintales('');
      setTipoCafe('');
      setPrecio('');
      setPeso('');

      alert('Venta realizada');// Mostrar el mensaje de alerta solo si la compra se ha completado con éxito

    } catch (error) {
      console.error('Error al guardar los datos:', error);
    };

    // Reiniciar la validación y el mensaje de error
    setFormValid(true);
    setErrorMessage('');
  }


  //final para funcion de guardar datos
  return (
    <div>
      <div className=" container mx-auto p-6 justify-center items-center h-screen ">
      <div className='px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 '>
        <h2 className="text-lg font-semibold mb-2 ">
          <p className='text-center'>
            INGRESO DE VENTAS
          </p>
        </h2>
        <p className="text-sm text-gray-600 mb-6">POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS</p>
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
                  type="number"
                  label="RTN"
                  id="rtn"
                  value={rtn}
                  onChange={(e) => setRTN(e.target.value)}
                  className="max-w-xs"
                  min={0}
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
                  label="Empresa"
                  id="nombre"
                  autoComplete="given-name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-1 ">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                <a className='font-bold text-lg'>
                  Tipo de Café
                </a>
              </label>
              <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                <Select
                  isRequired
                  id="tipoCafe"
                  label="Tipo Cafe"
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
              <label htmlFor="quintales" className="block text-sm font-medium leading-6 text-gray-900">
                <a className='font-bold text-lg'>
                  Quintales
                </a>
              </label>
              <div className="mt-2 pr-4">
                <Input
                  isRequired
                  type="number"
                  label="Unidades"
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
              <label htmlFor="peso" className="block text-sm font-medium leading-6 text-gray-900">
                <a className='font-bold text-lg'>
                  Peso Total
                </a>
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
              <label htmlFor="precio" className="block text-sm font-medium leading-6 text-gray-900">
                <a className='font-bold text-lg'>
                  Precio (Total)
                </a>
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
              type='submit' className='h-9 w-40 mt-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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

export default MainComponent;