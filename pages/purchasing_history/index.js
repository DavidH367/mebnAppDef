import { columns } from './datas';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionP';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { parse, isAfter, isBefore } from "date-fns";
import { startOfDay, endOfDay } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const purchasesRef = collection(db, 'purchases');

const ConsultasClientes = () => {


  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados
  
  const applyFilter = ({ rtn, startDate, endDate }) => {
    const filtered = data.filter((item) => {
      const itemDate = item.date.toDate();

      // Verifica si las fechas de inicio y fin están definidas
      const start = startDate ? startOfDay(startDate) : null;
      const end = endDate ? endOfDay(endDate) : null;

      // Comprueba si la fecha del elemento está dentro del rango (si se proporcionan fechas)
      const isWithinDateRange =
      (!start || isAfter(itemDate, start)) && (!end || isBefore(itemDate, end));

      return (
        item.rtn.toLowerCase().includes(rtn.toLowerCase()) && isWithinDateRange
      );
    });

    setFilteredData(filtered);
  };
  
  useEffect(() => {
    const fetchPurchases = async () => {
      const q = query(
        collection(db, "purchases"), 
        orderBy('date', 'desc'));

      const querySnapshot = await getDocs(q);

      const purchaseData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        purchaseData.push({ ...doc.data(), indexs: indexs++ });
      });
      setData(purchaseData);
      setFilteredData(purchaseData); // Inicializa los datos filtrados con los datos originales
    };
    fetchPurchases();    
    
  }, []);


  return(
    <div className="justify-items-center px-12">
      <h1 className=" text-2xl font-semibold pt-10 text-center">
      HISTORIAL DE CLIENTES
      </h1>

      <div className="container mx-auto p-4 justify-center items-center h-screen">
        <FilterSection onFilter={applyFilter} />
        <ReusableTable data={filteredData} columns={columns} />
      </div>
    </div>
)}

export default ConsultasClientes;