import { columns } from './datas';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit, where, from } from 'firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionCO';
import React, { useState, useEffect } from 'react';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { startOfDay, endOfDay } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";


const supliers_historyRef = collection(db, 'supliers_history');
const supliersInfoRef = collection(db, "supliers_info");
const supliersRef = collection(db, 'supliers');


const Providers = () => {
  //estados para las fechas de inicio y fin
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredDataf, setFilteredDataf] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);


  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false); // Estado para controlar si se ha aplicado el filtro
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados


  const applyFilter = ({ rtn, n_check, startDate, endDate }) => {
    const filtered = data.filter((item) => {
      const itemDate = item.date.toDate();
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      return (
        item.rtn.toLowerCase().includes(rtn.toLowerCase()) &&
        item.n_check.toLowerCase().includes(n_check.toLowerCase()) &&
        (!startDate || itemDate >= start) &&
        (!endDate || itemDate <= end)
      );
    });

    setFilteredData(filtered);
  };

  //traer datos de FireStore
  useEffect(() => {
    const fetchSupliers = async () => {
      const q = query(collection(db, "supliers_history"), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      const supliersData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        supliersData.push({ ...doc.data(), indexs: indexs++ });
      });
      setData(supliersData);
      setFilteredData(supliersData); // Inicializa los datos filtrados con los datos originales

    };
    fetchSupliers();

  }, []);

  //inicio de formulario
  //usos de datos
  const [supliers, fetchSupliers] = useState([]);
  const [rtn, setRTN] = useState('');
  const [n_cheque, setN_cheque] = useState('');
  const [n_documento, setN_documento] = useState('');
  const [pagado, setPagado] = useState('');


  // Estado para manejar la validez del formulario
  const [formValid, setFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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


  function handleSupplierChange(event) {
    const selectedSupplierValue = event.target.value;

    // Actualiza el estado con el nuevo valor seleccionado
    setSelectedSupplier(selectedSupplierValue);
  }

  const handleSubmit = async (event) => {
    const idDocumentos = selectedSupplier;

    event.preventDefault();

    // Verificar si los campos obligatorios están llenos
    if (!n_cheque || !n_documento) {
      setFormValid(false);
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
      return; // No enviar el formulario si falta algún campo obligatorio
    }

    // Obtener el último valor de "n_transaction"
    const querySnapshot1 = await getDocs(
      query(collection(db, 'supliers_history'), orderBy('n_transaction', 'desc'), limit(1)));

    const querySnapshot2 = await getDocs(
      query(collection(db, 'supliers'), orderBy('code', 'desc'), limit(1)));

    const querySnapshot3 = await getDocs(
      query(
        collection(db, 'supliers'),
        where('n_check', '==', n_cheque), // Filtrar por n_cheque
        where('n_document', '==', n_documento), // Filtrar por n_documento
        orderBy('code', 'desc'),
        limit(1)
      )
    );

    const querySnapshot4 = await getDocs(
      query(
        collection(db, 'supliers_history'),
        where('n_check', '==', n_cheque), // Filtrar por n_cheque
        where('n_document', '==', n_documento), // Filtrar por n_documento
        orderBy('date', 'desc'),
        limit(1)
      )
    );


    let auxRtn;
    const docId2 = idDocumentos;
    const docRef = doc(db, 'supliers_info', docId2); // Crear una referencia al documento específico
    const docSnapshot = await getDoc(docRef); // Obtener el snapshot del documento
    //obtener RTN
    if (docSnapshot.exists()) {
      // El documento existe, puedes acceder al valor de rtn
      auxRtn = docSnapshot.data().rtn;
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

    //obbtener codigo
    let auxCode;
    const docRef3 = doc(db, 'supliers_info', docId2); // Crear una referencia al documento específico
    const docSnapshot2 = await getDoc(docRef3); // Obtener el snapshot del documento
    if (docSnapshot2.exists()) {
      // El documento existe, puedes acceder al valor de rtn
      auxCode = docSnapshot2.data().code;
    } else {
      // El documento no existe
      console.log('El documento no existe.');
    }

    let newCapital;
    // Verificar si se encontraron documentos
    if (!querySnapshot3.empty) {
      // Obtener el primer documento encontrado
      const doc = querySnapshot3.docs[0];
      // Acceder al campo "capital" y asignarlo a la variable
      newCapital = doc.data().capital;
    } else {
      console.log('No se encontraron resultados.');
    }

    let newPending;
    // Verificar si se encontraron documentos
    if (!querySnapshot4.empty) {
      // Obtener el primer documento encontrado
      const doc = querySnapshot4.docs[0];
      // Acceder al campo "capital" y asignarlo a la variable
      newPending = doc.data().pending;
    } else {
      console.log('No se encontraron resultados.');
    }

    let numTrans;
    if (!querySnapshot1.empty) {
      querySnapshot1.forEach((doc) => {
        numTrans = doc.data().n_transaction + 1;
      });
    } else {
      numTrans = 1; // Si no hay documentos anteriores, empezar desde 1
    }

    let code1;
    if (!querySnapshot2.empty) {
      querySnapshot2.forEach((doc) => {
        code1 = doc.data().code + 1;
      });
    } else {
      code1 = 1; // Si no hay documentos anteriores, empezar desde 1
    }
    const rtnValue = rtn || "CF";

    //validacion de datos antes de guardar:

    // Verificar si se están ingresando más de lo que se debe
    let auxStatus;
    if (parseFloat(pagado) > parseFloat(newPending)) {
      alert('Estás ingresando más de lo que se debe. Por favor, verifica los valores.');
      return;
    } else {
      auxStatus = 'activo';
    }

    // Verificar si el campo 'pending' ya es igual a cero y actualizar el campo 'status'
    if ((parseFloat(newPending) - parseFloat(pagado)) === 0) {
      auxStatus = 'completado';

    } else {
      auxStatus = 'activo';
    }


    // Crear una consulta que busca documentos que coincidan con las condiciones
    let docId;
    const q = query(
      collection(db, 'supliers'),
      where('n_check', '==', n_cheque),
      where('n_document', '==', n_documento)
    );
    try {
      const querySnapshot = await getDocs(q);
      // Verificar si se encontraron documentos que cumplan con las condiciones
      if (!querySnapshot.empty) {
        // Obtener el primer documento que cumple con las condiciones
        const doc = querySnapshot.docs[0];
    
        // Obtener el docId del documento
        docId = doc.id;
    
        console.log('DocId encontrado:', docId);
      } else {
        console.log('No se encontraron documentos que cumplan con las condiciones.');
      }
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
    }
    
    const supliersDocRef = doc(db, 'supliers', docId);
    console.log('DocId encontrado lueego:', docId);
    const newInvData = {
      pending: parseFloat(newPending - pagado),
      paid: parseFloat(pagado),
      status: auxStatus,
    };

    const newData = {
      capital: parseFloat(newCapital),
      code: auxCode,
      date: new Date(), // Guardar la fecha actual en Firebase
      n_check: n_cheque,
      n_document: n_documento,
      name: auxName,
      pending: parseFloat(newPending - pagado),
      paid: parseFloat(pagado),
      rtn: auxRtn,
      status: auxStatus,
    };

    try {

      await updateDoc(supliersDocRef, newInvData);
      await addDoc(supliers_historyRef, newData);

      // Limpiar los campos del formulario después de guardar
      setN_cheque('');
      setN_documento('');
      setPagado('');
      setSelectedSupplier('');

      alert('Registro Ingresado con Exito');
    } catch (error) {
      alert('No se pudo ingresar Registro, algunos datos no esta correctos.');
      console.error('Error al guardar los datos:', error);
    };

    // Reiniciar la validación y el mensaje de error
    setFormValid(true);
    setErrorMessage('');

  }

  return <div>  
    <div className='px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 '>
      <h2 className="text-lg font-semibold mb-2 ">
        <p className='text-center'>
          Actualizar Prestamos o Anticipos:
        </p>
      </h2>
      <p className="text-sm text-gray-600 mb-6">POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS</p>
      <form onSubmit={handleSubmit} >
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="sm:col-span-1">
            <label htmlFor="n_cheque" className="block text-sm font-medium leading-6 text-gray-900">
              <a className='font-bold text-lg'>
                PROVEEDOR
              </a>
            </label>
            <div className="mt-2 pr-4">
              <Select
                items={suppliers}
                label="Actualizar a:"
                placeholder="Selecciona un Proveedor"
                className="max-w-xs"
                value={selectedSupplier}
                onChange={handleSupplierChange}
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
            <label htmlFor="n_cheque" className="block text-sm font-medium leading-6 text-gray-900">
              <a className='font-bold text-lg'>
                N° CHEQUE
              </a>
            </label>
            <div className="mt-2 pr-4">
              <Input
                isRequired
                type="text"
                label="N° de Cheque"
                id="n_cheque"
                autoComplete="family-name"
                value={n_cheque}
                onChange={(e) => setN_cheque(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="n_documento" className="block text-sm font-medium leading-6 text-gray-900">
              <a className='font-bold text-lg'>
                N° DOCUMENTO
              </a>
            </label>
            <div className="mt-2 pr-4">
              <Input
                isRequired
                type="text"
                label="N° Documento"
                id="n_documento"
                autoComplete="family-name"
                value={n_documento}
                onChange={(e) => setN_documento(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>


          <div className="sm:col-span-1">
            <label htmlFor="pagado" className="block text-sm font-medium leading-6 text-gray-900">
              <a className='font-bold text-lg'>
                ABONO
              </a>
            </label>
            <div className="mt-2 pr-4">
              <Input
                isRequired
                type="number"
                label="L"
                step="0.01"
                id="pagado"
                autoComplete="pagado"
                value={pagado}
                onChange={(e) => setPagado(e.target.value)}
                className="max-w-xs"
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
    <div>
      <FilterSection onFilter={(filterValues) => applyFilter(filterValues)} />
      <ReusableTable data={filteredData} columns={columns} />
    </div>

  </div>
}

export default Providers;