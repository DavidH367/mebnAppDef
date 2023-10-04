import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionP';

import { columns } from "./datas";
import { Divider } from "@nextui-org/react";
import Estados from '@/Components/Form/stats';
import  NavBar  from '../../Components/Layout/NavBar';
import { startOfDay, endOfDay } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const invRef = collection(db, 'inventories');


const IntakeControl = () => {

  //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados

  //paginado
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  //mostrar datos
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "inventories"), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      const inventoriesData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        inventoriesData.push({ ...doc.data(), Inventories_id: doc.id, indexs: indexs++ });
      });
      setData(inventoriesData);
      setFilteredData(inventoriesData); // Inicializa los datos filtrados con los datos originales
    };

    fetchData();
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


  return (
    
    <div>
      <NavBar/>
      <div className="grid grid-cols-1 divide-y" >
      <div>
        <Estados/>
      </div>
      <div >
        <div className="container mx-auto p-4 justify-center items-center h-screen">
          <h1>Control de Inventario de Cafe</h1>
          <FilterSection onFilter={applyFilter} />
          <ReusableTable data={filteredData} columns={columns} />
        </div>
      </div>
    </div>
    </div>

  );
};

export default IntakeControl;