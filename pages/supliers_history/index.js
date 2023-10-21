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
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import { columns, tipoC } from "../../Data/supliers_history/datas";


const Providers = () => {

  //inicio para el filtro de datos
  const [data, setData] = useState([]);
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


  return <div className="container mx-auto p-10 justify-center items-center h-full">
    <div>
      <FilterSection onFilter={(filterValues) => applyFilter(filterValues)} />
      <ReusableTable data={filteredData} columns={columns} />
    </div>
  </div>
}

export default Providers;