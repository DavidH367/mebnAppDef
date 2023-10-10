import React, { useState, useEffect } from "react";
import "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import ReusableTable from "../../Components/Form/ReusableTable";
import FilterSection from "../../Components/Form/FilterSectionP";

import { columns } from "./datas";
import Estados from "@/Components/Form/stats";
import { startOfDay, endOfDay } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";

const invRef = collection(db, "inventories");
const IntakeControl = () => {
  //inicio para el filtro de datos
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Agrega el estado para los datos filtrados

  //paginado
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  //Valida acceso a la pagina
  const { user, errors, setErrors } = useAuth();
  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);
  //mostrar datos
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "inventories"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const inventoriesData = [];
      let indexs = 1;
      querySnapshot.forEach((doc) => {
        inventoriesData.push({
          ...doc.data(),
          Inventories_id: doc.id,
          indexs: indexs++,
        });
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
      <div className="container mx-auto p-10 justify-center items-center h-full">
        <h1 className=" text-2xl font-semibold text-center mb-5">
          CONTROL DE INGRESOS Y EGRESOS DE CAFÉ
        </h1>
        <div>
          <Estados />
        </div>
        <div>
          <div className="container mx-auto p-4 justify-center items-center h-screen">
            <FilterSection onFilter={applyFilter} />
            <ReusableTable data={filteredData} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeControl;
