import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import PurchasesTable from '../../Components/Layout/PurchasesTable';
import { Input } from '@nextui-org/react';

const purchasesRef = collection(db, 'purchases');
const Purchasing1 = () => {
    
  const [purchases, setPurchases] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [zona, setZona] = useState('');
  const [tipoCafe, setTipoCafe] = useState('');
  const [precio, setPrecio] = useState('');
  const [quintales, setQuintales] = useState('');
  const [peso, setPeso] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);
  
    const fetchPurchases = async () => {
      const q = query(collection(db, "purchases"));
      const querySnapshot = await getDocs(q);

      const purchaseData = [];
      querySnapshot.forEach((doc) => {
        purchaseData.push({ ...doc.data() });
      });

      setPurchases(purchaseData);
    };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newData = {
      name: nombre,
      last_name: apellido,
      zone: zona,
      coffee_type: tipoCafe,
      total: precio,
      bags: quintales,
      weight: peso,
      date: new Date() // Guardar la fecha actual en Firebase
    };

    await addDoc(purchasesRef, newData)
      .then(() => {
        // Limpiar los campos del formulario después de guardar
        setNombre('');
        setApellido('');
        setZona('');
        setTipoCafe('');
        setPrecio('');
        setQuintales('');
        setPeso('');
        
        // Actualizar la lista de compras
        fetchPurchases();
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
          INFORMACION DE COMPRAS
        </p>
      </h1>

    <div className='px-8 '>
      <div className="bg-white shadow rounded p-4 box-border h-400 w-800 p-2 border-4 ">
          <h2 className="text-lg font-semibold mb-2 ">
            <p className='text-center'>
              Ingresar Compras:
            </p>
          </h2>
          <p className="text-sm text-gray-600 mb-6">POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS</p>

        <form onSubmit={handleSubmit} >
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
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
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
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  <input
                    id="fecha"
                    name="fecha"
                    placeholder={Date()}
                    type="text"
                    autoComplete="email"
                    disabled
                     
                    className="cursor-not-allowed block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="zona" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    Zona
                  </a>
                </label>
                <div className="mt-2 pr-4">
                  <select
                    id="zona"
                    name="zona"
                    defaultValue={"Zona"}
                    autoComplete="zona"
                    value={zona}
                    onChange={(e) => setZona(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option selected>Zona</option>
                    <option>San Jose de Pane</option>
                    <option>El Matazano</option>
                    <option>Guachipilin</option>
                    <option>Cantoral</option>
                    <option>Montañuela</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1 ">
                <label htmlFor="tipoCafe" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    Tipo de Café
                  </a>
                </label>
                <div className="mt-2 pr-4">
                  <select
                    id="tipoCafe"
                    name="tipoCafe"
                    defaultValue={"Tipo de Café"}
                    autoComplete="tipoCafe"
                    value={tipoCafe}
                    onChange={(e) => setTipoCafe(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option selected >Tipo de Café</option>
                    <option>Uva</option>
                    <option>Pergamino Mojado</option>
                    <option>Pergamino Seco</option>
                    <option>Pergamino Humedo</option>
                  </select>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="quintales" className="block text-sm font-medium leading-6 text-gray-900">
                <a className='font-bold text-lg'>
                  Quintales
                </a>
              </label>
              <div className="mt-2 pr-4">
                <input
                  type="number"
                  name="quintales"
                  step="0.01"
                  id="quintales"
                  autoComplete="quintales"
                  value={quintales}
                  onChange={(e) => setQuintales(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="peso" className="block text-sm font-medium leading-6 text-gray-900">
                <a className='font-bold text-lg'>
                  Peso (Lbs)                  
                </a>
              </label>
              <div className="mt-2 pr-4">
                <input
                  type="number"
                  name="peso"
                  step="0.01"
                  id="peso"
                  autoComplete="peso"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                <input
                  type="number"
                  name="precio"
                  step="0.01"
                  id="precio"
                  autoComplete="precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
              <button 
                onClick={() => {alert('Compra realizada')}} 
                type='submit' className='h-9 w-40 mt-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                  Guardar
              </button>            
          </div>
        </form>
      </div>
    </div> 
        <div className="grid h-80 card bg-base-200 rounded-box place-items-top flex-grow">
          <PurchasesTable purchases={purchases} />
        </div>
    </div>
  </div>
    
  );
};

export default Purchasing1;