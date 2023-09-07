import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy} from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionI';
import { columns } from "./datas";
import {Divider} from "@nextui-org/react";
import Estados from '@/Components/Form/stats';

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
      const q = query(collection(db, "inventories"), orderBy('date','desc'));
      const querySnapshot = await getDocs(q);

      const inventoriesData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        inventoriesData.push({ ...doc.data(), Inventories_id: doc.id, indexs: indexs++});
      });
      setData(inventoriesData);
      setFilteredData(inventoriesData); // Inicializa los datos filtrados con los datos originales
    };

    fetchData();
  }, []);

  const applyFilter = (value) => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  

  return( 
  <div class="grid grid-cols-1 divide-y">
    <div>
       <Estados />
    </div>
    <div>
      <h1 className=''>Control de Inventario de Cafe</h1>
      <ReusableTable data={filteredData} columns={columns}/> 
    </div>
  </div>
  
  );
};

export default IntakeControl;