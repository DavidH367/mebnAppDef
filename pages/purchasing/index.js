import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionP.js'; // Asegúrate de ajustar la ruta correcta
import { zonas, tipoC, columns } from './datas';
import { Input, Select, SelectItem } from '@nextui-org/react';
import  NavBar  from '../../Components/Layout/NavBar';
import  VerPDFButton  from '../../Components/Form/PDFButton';

const purchasesRef = collection(db, 'purchases');
const invRef = collection(db, 'inventories');



const Purchasing1 = () => {
  //datos para factura

  //usos de datos
  const [purchases, fetchPurchases] = useState([]);
  const [rtn, setRTN] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [zona, setZona] = useState('');
  const [tipoCafe, setTipoCafe] = useState('');
  const [precio, setPrecio] = useState('');
  const [quintales, setQuintales] = useState('');
  const [peso, setPeso] = useState('');

  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados
  
  // Estado para manejar la validez del formulario
  const [formValid, setFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  //fin del filtro

  // Función para guardar datos
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si los campos obligatorios están llenos
    if (!nombre || !apellido || !zona || !tipoCafe || !quintales || !peso || !precio) {
      setFormValid(false);
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
      return; // No enviar el formulario si falta algún campo obligatorio
    }

    try{
       // Obtener el último valor de "n_transaction"
        const querySnapshot1 = await getDocs(
          query(collection(db, 'inventories'), orderBy('n_transaction', 'desc'), limit(1)));
        const querySnapshot2 = await getDocs(
          query(collection(db, 'inventories'), orderBy('n_transaction', 'desc'), limit(1)));

        let numTrans;
        

        if (!querySnapshot1.empty) {
          querySnapshot1.forEach((doc) => {
            numTrans = doc.data().n_transaction + 1;
          });
        } else {
          numTrans = 1; // Si no hay documentos anteriores, empezar desde 1
        } 


        let newBalance2;
        if (!querySnapshot2.empty) {
          querySnapshot2.forEach((doc) => {
            newBalance2 = doc.data().balance + parseFloat(precio);
          });
        } else {
          newBalance2 = 1; // Si no hay documentos anteriores, empezar desde 1
        }
        const rtnValue = rtn || "CF";
        // Incrementar el valor de "n_transaction" para el nuevo documento

      const newData = {
            rtn: rtnValue,
            name: nombre,
            last_name: apellido,
            zone: zona,
            coffee_type: tipoCafe,
            total: parseFloat(precio),
            bags: parseFloat(quintales),
            weight: parseFloat(peso),
            date: new Date(), // Guardar la fecha actual en Firebase
            n_transaction: numTrans,
          };

          const newInvData = {
            rtn: rtnValue,
            tran_type: 'COMPRA',  
            coffee_type: tipoCafe,
            value: parseFloat(precio),
            weight: parseFloat(peso),
            date: new Date(), // Guardar la fecha actual en Firebase
            n_transaction: numTrans,
            balance: newBalance2,
          };

      await addDoc(purchasesRef, newData)
      await addDoc(invRef, newInvData)
      
      // Obtener los datos recién guardados desde Firestore
        const querySnapshot = await getDocs(query(collection(db, "purchases"), orderBy('date', 'desc')));
        const purchaseData4 = [];
        let indexs = 1;
        querySnapshot.forEach((doc) => {
          purchaseData4.push({ ...doc.data(), indexs: indexs++ });
        });

      const pdfBlob = await PDFDocument({
            nombre,
            apellido,
            zona,
            tipoCafe,
            precio,
            quintales,
            peso,
            purchases: purchaseData4, // Pasa los datos de las compras al generador de PDF
          });

    // Guarda el PDF en una ubicación accesible (puedes cambiar la ruta según tus necesidades)
    // Ejemplo usando FileSaver.js (asegúrate de importar FileSaver.js en tu proyecto)
    saveAs(pdfBlob, 'factura.pdf');

      

      // Generar el PDF con los datos obtenidos
    

    saveAs(pdfBlob, 'factura.pdf');
      //await fetchPurchases();

      

      

      // Guarda el PDF en una ubicación accesible (puedes cambiar la ruta según tus necesidades)
    // Ejemplo usando FileSaver.js (asegúrate de importar FileSaver.js en tu proyecto)
    
   
          // Limpiar los campos del formulario después de guardar
          setRTN('');
          setNombre('');
          setApellido('');
          setZona('');
          setTipoCafe('');
          setPrecio('');
          setQuintales('');
          setPeso('');
          
          // Actualizar la lista de compras
          
          // Actualizar la lista de compras
        setData(purchaseData);
        setFilteredData(purchaseData);
          // Mostrar el mensaje de alerta solo si la compra se ha completado con éxito
          
          
            // Guarda el PDF en una ubicación accesible
            
          
        alert('Compra realizada');
        }catch(error) {
          console.error('Error al guardar los datos:', error);
        };

        // Reiniciar la validación y el mensaje de error
        setFormValid(true);
        setErrorMessage('');
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto flex justify-center items-center h-screen">
      <div className=" container mx-auto p-6 justify-center items-center h-screen ">
        <div className='px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 '>
          <h2 className="text-lg font-semibold mb-2 ">
            <p className='text-center'>
              Ingresar Compras:
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
                      label="nombre"
                      id="nombre"
                      autoComplete="given-name"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="max-w-xs"
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
                    <Input
                      isRequired
                      type="text"
                      label="apellido"
                      id="apellido"
                      autoComplete="family-name"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                  <div className="col-span-1">
                    <label htmlFor="fecha" className="block text-sm font-medium leading-6 text-gray-900">
                      <a className='font-bold text-lg'>
                        Fecha
                      </a>
                    </label>
                    <div className="mt-2 pr-4 ">
                      <Input
                        id="fecha"
                        label="fecha"
                        placeholder={Date()}
                        type="text"
                        autoComplete="email"
                        disabled
                        className="max-w-xs"
                        />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="zona" className="block text-sm font-medium leading-6 text-gray-900">
                      <a className='font-bold text-lg'>
                        Zona
                      </a>
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
                    />
                  </div>
                </div>
                  <button 
                    type='submit' className='h-9 w-40 mt-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  > 
                    Guardar
                    
                  </button>
                  <VerPDFButton />

                             
              </div>
              
            </form>
        </div> 
          
    </div>
  </div>
    </div>
    
  );
};

export default Purchasing1;