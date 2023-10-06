import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSection from '../../Components/Form/FilterSectionP'; // Asegúrate de ajustar la ruta correcta
import { columns, tipoC } from './datas';
import { startOfDay, endOfDay } from 'date-fns';
const salesRef = collection(db, 'sales');
const invRef = collection(db, 'inventories');


const ConsultaVentas = () => {
    //inicio para el filtro de datos
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados

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
    return(
      <div className="justify-items-center px-12">
        <h1 className=" text-2xl font-semibold pt-10 text-center">
          HISTORIAL DE VENTAS
        </h1>
        
        <div className="container mx-auto p-4 justify-center items-center h-screen">
          {/* <h2 className="text-lg font-semibold mb-5 text-center" >
          </h2> */}
          <FilterSection onFilter={applyFilter} />
          <ReusableTable data={filteredData} columns={columns} />
        </div>
      </div>
    )};
    
export default ConsultaVentas;