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
import { tipoC } from "../../Data/sales/datas";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";

const salesRef = collection(db, "sales");
const supliers_historyRef = collection(db, 'supliers_history');
const supliersInfoRef = collection(db, "supliers_info");


const MainComponent = () => {
  //usos de datos
  const [tipoCafe, setTipoCafe] = useState("");
  const [quintales, setQuintales] = useState("");
  const [peso, setPeso] = useState("");
  const [pagado, setPagado] = useState('');
  const [n_documento, setN_documento] = useState('');

  //select con proveedores
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados

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

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "sales"), orderBy("date", "desc"));
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

  // Función para aplicar el filtro
  const applyFilter = (value) => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  //Funcion para guardar datos
  const handleSubmit = async (event) => {
    const idDocumentos = selectedSupplier;
    event.preventDefault();

    // Verificar si los campos obligatorios están llenos
    if (!tipoCafe || !quintales || !peso) {
      setFormValid(false);
      setErrorMessage("Por favor, complete todos los campos obligatorios.");
      return; // No enviar el formulario si falta algún campo obligatorio
    }

    try {
      // Obtener el último valor de "n_transaction"
      const querySnapshot1 = await getDocs(
        query(
          collection(db, "inventories"),
          orderBy("n_transaction", "desc"),
          limit(1)
        )
      );
      //obtener el ultimo valor de balance
      const querySnapshot2 = await getDocs(
        query(
          collection(db, "inventories"),
          orderBy("n_transaction", "desc"),
          limit(1)
        )
      );
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



      //asignar el nuevo valor de numero transaccion
      let numTrans;

      if (!querySnapshot1.empty) {
        querySnapshot1.forEach((doc) => {
          numTrans = doc.data().n_transaction + 1;
        });
      } else {
        numTrans = 1; // Si no hay documentos anteriores, empezar desde 1
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
        auxRtn = "Consumidor Final";
      }

      const querySnapshot4 = await getDocs(
        query(
          collection(db, 'supliers'),
          where('code', '==', auxCode), // Filtrar por n_cheque
          orderBy('code', 'desc'),
          limit(1)
        )
      );

      //traer capital anterior
      let sCap;
      if (!querySnapshot4.empty) {
        querySnapshot4.forEach((doc) => {
          sCap = doc.data().capital;
        });
      } else {
        sCap = 0; // Si no hay documentos anteriores, empezar desde 1
      }

      //traer pendiente anterior
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

      //traer ultimo pagado 
      let newPaid;
      // Verificar si se encontraron documentos
      if (!querySnapshot4.empty) {
        // Obtener el primer documento encontrado
        const doc = querySnapshot4.docs[0];
        // Acceder al campo "paid" y asignarlo a la variable
        newPaid = doc.data().paid;
      } else {
        newPaid = 0;
      }


      // Verificar si se están ingresando más de lo que se debe
      if (parseFloat(pagado) > parseFloat(newPending)) {
        alert('Estás ingresando más de lo que se debe. Por favor, verifica los valores.');
        return;
      }

      // Crear una consulta que busca documentos que coincidan con las condiciones
      let docId;
      const q = query(
        collection(db, 'supliers'),
        where('code', '==', auxCode), 
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
      //obtener peso neto:
      let pNeto;
      pNeto = peso - quintales;

      const newData = {
        rtn: auxRtn,
        name: auxName,
        type: tipoCafe,
        bags_sold: parseFloat(quintales),
        weight: parseFloat(peso),
        weightN: parseFloat(pNeto),
        total: parseFloat(pagado),
        date: new Date(), // Guardar la fecha actual en Firebase
        n_transaction: numTrans,
      };


      const newsupData = {
        capital: parseFloat(pagado),
        code: auxCode,
        date: new Date(), // Guardar la fecha actual en Firebase
        n_check: 'N/A',
        n_document: n_documento,
        name: auxName,
        rtn: auxRtn,
        status: 'Abono a Capital',
      };

      const newUpdateDataSupliers = {
        capital: parseFloat(sCap - parseFloat(pagado)),
        date: new Date(), // Guardar la fecha actual en Firebase
        paid: parseFloat(newPaid + parseFloat(pagado)),
        pending: parseFloat(newPending - parseFloat(pagado)),
        rtn: auxRtn,
      };

      await addDoc(salesRef, newData);
      await addDoc(supliers_historyRef, newsupData);
      await updateDoc(supliersDocRef, newUpdateDataSupliers);

      // Limpiar los campos del formulario después de guardar
      setSelectedSupplier('');
      setN_documento("");
      setTipoCafe("");
      setQuintales("");
      setPeso("");
      setPagado("");

      alert("Venta realizada"); // Mostrar el mensaje de alerta solo si la compra se ha completado con éxito
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }

    // Reiniciar la validación y el mensaje de error
    setFormValid(true);
    setErrorMessage("");
  };

  //final para funcion de guardar datos
  return (
    <div className="espacio">
      <div className="container mx-auto p-10 justify-center items-center h-full">
        <div className='px-8 bg-white shadow rounded-lg shadow-lg  p-4 box-border h-400 w-800 p-2 border-4 mb-10'>
          <h2 className="text-lg font-semibold mb-2 ">
            <p className='text-center'>
              DEPOSITO O VENTA DE CAFÉ:
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
                <label htmlFor="n_documento" className="block text-sm font-medium leading-6 text-gray-900">
                  <a className='font-bold text-lg'>
                    FACTURA
                  </a>
                </label>
                <div className="mt-2 pr-4">
                  <Input
                    isRequired
                    type="text"
                    label="N° Factura"
                    id="n_documento"
                    autoComplete="family-name"
                    value={n_documento}
                    onChange={(e) => setN_documento(e.target.value)}
                    className="max-w-xs"
                  />
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
                <label
                  htmlFor="peso"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  <a className="font-bold text-lg">Peso Total</a>
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

export default MainComponent;
