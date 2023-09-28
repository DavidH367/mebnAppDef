import Link from "next/link";
import NavBar from '../../Components/Layout/NavBar';
import {columns } from './datas';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionP';
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";

const purchasesRef = collection(db, 'purchases');



const ConsultasClientes = () => {

    //inicio para el filtro de datos
const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados
const [filterValues, setFilterValues] = useState('');
const [fechaDesde, setFechaDesde] = useState(null);
const [fechaHasta, setFechaHasta] = useState(null);
const [applyFilterClicked, setApplyFilterClicked] = useState(false);
const [currentPage, setCurrentPage] = useState(1); // Agrega esta línea para definir setCurrentPage
const [itemsPerPage] = useState(10);


  
  const applyFilter = (filterValues, fechaDesde, fechaHasta) => {
    // Filtra los datos en función de los valores de filtro seleccionados
    const filtered = data.filter((item) => {
      let rtnMatch = true;
      let fechaDesdeMatch = true;
      let fechaHastaMatch = true;

      // Comprueba si el RTN coincide con el valor de filtro seleccionado
      if (filterValues.rtn) {
        rtnMatch = item.rtn === filterValues.rtn;
      }

      // Comprueba si la fecha de inicio coincide con el rango de fechas seleccionado (si se seleccionaron)
      if (fechaDesde && fechaHasta) {
        fechaDesdeMatch = item.date && item.date >= fechaDesde;
        fechaHastaMatch = item.date && item.date <= fechaHasta;
      }

      // Devolver verdadero si coincide con RTN y el rango de fechas (si se seleccionaron)
      return rtnMatch && fechaDesdeMatch && fechaHastaMatch;
    });

    // Establece los datos filtrados en el estado
    setFilteredData(filtered);
    // Reinicia la paginación a la primera página
    setCurrentPage(1);
    
     // Reinicia la paginación a la primera página
  };
  
  //fin del filtro
useEffect(() => {
    const fetchPurchases = async () => {
    const q = query(collection(db, "purchases"), orderBy('date','desc'));
    const querySnapshot = await getDocs(q);

    const purchaseData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        purchaseData.push({ ...doc.data(),indexs: indexs++ });
    });
      setData(purchaseData);
      setFilteredData(purchaseData); // Inicializa los datos filtrados con los datos originales
    };
    fetchPurchases();
  }, []);

    return <div className="p-28">
        <NavBar />
        <h2 className="text-lg font-semibold mb-2 p-12">
            <p className='text-center'>
                CONSULTAS DE CLIENTES
            </p>
        </h2>
        <div >
        <div className="grid h-80 card bg-base-200 rounded-box place-items-top flex-grow">
            <h1 className="text-2xl font-semibold mb-4 " >
              <p className='text-center'>
                INFORMACION DE COMPRAS
              </p>
            </h1>
            <FilterSection onFilter={(filterValues , fechaDesde, fechaHasta) => applyFilter(filterValues, fechaDesde, fechaHasta)} />
            <ReusableTable data={filteredData} columns={columns}/>
          </div>
        </div>

        

    </div>
}

export default ConsultasClientes;