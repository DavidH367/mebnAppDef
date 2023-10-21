import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { zonas, tipoC, columns } from './datas';
import { Input, Select, SelectItem, Checkbox } from '@nextui-org/react';
import FilterSection from '../../Components/Form/FilterSectionCO';
import ReusableTable from '../../Components/Form/ReusableTable';
import { startOfDay, endOfDay } from 'date-fns';
import SuppliersModal from '../../Components/Form/SuppliersModal';
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";

const supliers_historyRef = collection(db, 'supliers_history');
const supliersInfoRef = collection(db, "supliers_info");
const supliersRef = collection(db, 'supliers');

const Providers = () => {
  
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  //estado par el checkbox
  const [inputDisabled, setInputDisabled] = useState(false);

  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false); // Estado para controlar si se ha aplicado el filtro
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados

  //Valida acceso a la pagina
  const router = useRouter();
  const { user, errors, setErrors } = useAuth();
  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);

  const applyFilter = ({ rtn, startDate, endDate }) => {
    const filtered = data.filter((item) => {
      const itemDate = item.date.toDate();
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      return (
        item.rtn.toLowerCase().includes(rtn.toLowerCase()) &&
        (!startDate || itemDate >= start) &&
        (!endDate || itemDate <= end)
      );
    });

    setFilteredData(filtered);
  };

  //traer datos de FireStore
  useEffect(() => {
    const fetchSupliers = async () => {
      const q = query(collection(db, "supliers"),
        orderBy('date', 'desc'));
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

  //usos de datos

  const [n_cheque, setN_cheque] = useState('');
  const [n_documento, setN_documento] = useState('');
  const [capital, setCapital] = useState('');


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

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    // Si el Checkbox está marcado
    if (isChecked) {
      setN_cheque(''); // Limpia el valor de n_cheque
      setN_cheque('EFECTIVO'); // Establece el valor de n_check como 'EFECTIVO'
    } else {
      setN_cheque(''); // Limpia el valor de n_check si el Checkbox está desmarcado
    }
    // Actualiza el estado del Input y el Checkbox
    setInputDisabled(isChecked);
  };



  const handleSubmit = async (event) => {
    const idDocumentos = selectedSupplier;

    event.preventDefault();
    try {
      // Verificar si los campos obligatorios están llenos
      if (!n_documento) {
        setFormValid(false);
        setErrorMessage('Por favor, Ingrese el numero de Factura.');
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

      const querySnapshot4 = await getDocs(
        query(
          collection(db, 'supliers'),
          where('code', '==', auxCode), // Filtrar por n_cheque
          orderBy('code', 'desc'),
          limit(1)
        )
      );

      let sCap;
      if (!querySnapshot4.empty) {
        querySnapshot4.forEach((doc) => {
          sCap = doc.data().capital;
        });
      } else {
        sCap = 0; // Si no hay documentos anteriores, empezar desde 1
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
      let newPending;
      // Verificar si se encontraron documentos
      if (!querySnapshot4.empty) {
        // Obtener el primer documento encontrado
        const doc = querySnapshot4.docs[0];
        // Acceder al campo "capital" y asignarlo a la variable
        newPending = doc.data().pending;
      } else {
        newPending = 0;
      }

      // Crear una consulta que busca documentos que coincidan con las condiciones
      let docId;
      const q = query(
        collection(db, 'supliers'),
        where('code', '==', auxCode), // Filtrar por n_cheque
        orderBy('code', 'desc'),
        limit(1)
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

      const newData = {
        capital: parseFloat(parseFloat(capital) + sCap),
        date: new Date(), // Guardar la fecha actual en Firebase
        pending: parseFloat(parseFloat(capital) + newPending),
        rtn: auxRtn,
      };

      const newInvData = {
        rtn: auxRtn,
        status: 'Ingreso de Capital',
        name: auxName,
        date: new Date(), // Guardar la fecha actual en Firebase
        n_check: n_cheque,
        n_document: n_documento,
        capital: parseFloat(capital),
        code: auxCode,
      };

      await updateDoc(supliersDocRef, newData)
      await addDoc(supliers_historyRef, newInvData)

      // Limpiar los campos del formulario después de guardar
      setSelectedSupplier('');
      setN_cheque('');
      setN_documento('');
      setCapital('');

      alert('Registro Ingresado con Exito');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    };

    // Reiniciar la validación y el mensaje de error
    setFormValid(true);
    setErrorMessage('');

  }
  return (
    <div className="">
      <div className="container mx-auto p-10 justify-center items-center">
        <div className='px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 mb-10'>
          <h2 className="text-lg font-semibold mb-2 ">
            <p className='text-center'>
              INGRESAR CAPITAL
            </p>
          </h2>
          <p className="text-sm text-gray-600 mb-6">POR FAVOR LLENAR TODOS LOS CAMPOS NECESARIOS</p>
          <form onSubmit={handleSubmit} >
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="sm:col-span-1">
                <label htmlFor="n_cheque" className="block text-sm font-medium leading-6 text-gray-900">
                  <div>
                    <a className='font-bold text-lg'>
                      PROVEEDOR {""}
                    </a>
                    <SuppliersModal />
                  </div>
                </label>
                <div className="mt-2 pr-4">
                  <Select
                    items={suppliers}
                    isRequired
                    label="Agregar Capital de:"
                    placeholder="Selecciona un Proveedor"
                    className="max-w-xs"
                    value={selectedSupplier}
                    onChange={handleSupplierChange}
                  >
                    {(userP) => (
                      <SelectItem key={userP.id} textValue={userP.name}>
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col">
                            <span className="text-small">{userP.name}</span>
                            <span className="text-tiny text-default-400">RTN: {userP.rtn}</span>
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
                    N° DOCUMENTO
                  </a>
                </label>

                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="N° Cheque/Efectivo"
                    id="n_cheque"
                    autoComplete="family-name"
                    value={n_cheque}
                    onChange={(e) => setN_cheque(e.target.value)}
                    className="max-w-xs"
                    isDisabled={inputDisabled} // Habilita o deshabilita el Input según el estado del Checkbox
                  />
                </div>
                <div className="mt-2 pr-4">
                  <Checkbox
                    label="Efectivo"
                    size="lg"
                    color="secondary"
                    onChange={handleCheckboxChange}
                  >
                    EFECTIVO
                  </Checkbox>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="n_documento" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    N° FACTURA
                  </a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="A1234"
                    id="n_documento"
                    autoComplete="family-name"
                    value={n_documento}
                    onChange={(e) => setN_documento(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="capital" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    CAPITAL
                  </a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="number"
                    label="L"
                    step="0.01"
                    id="capital"
                    autoComplete="capital"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="max-w-xs"
                    min={1}
                    placeholder={100}
                  />
                </div>
              </div>
              <button
                type='submit' className='h-9 w-40 mt-11 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 ">
            <p className='text-center'>
              PRESTAMOS RECIENTES
            </p>
          </h2>
          <FilterSection onFilter={(filterValues) => applyFilter(filterValues)} />
          <ReusableTable data={filteredData} columns={columns} />
        </div>

      </div>
    </div>
  );
}

export default Providers;