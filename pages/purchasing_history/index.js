import { columns } from '../../Data/purchasing_history/datas';
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
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import Estados from "@/Components/Form/statsC";

const ConsultasClientes = () => {

  const [totalCompras, setTotalCompras] = useState(0);
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

  //inicializar datos de stats
  useEffect(() => {
    //suma de total en ventas
    const fetchData = async () => {
      const querySnapshot1 = await getDocs(
        query(collection(db, "purchases"), orderBy("date", "desc"))
      );

      let latestPurchases = 0;
      querySnapshot1.forEach((doc) => {
        const data = doc.data();
        // Asegúrate de que la propiedad 'value' exista en el documento
        if (data.hasOwnProperty("total")) {
          latestPurchases += data.total; // Suma el valor de 'total' al total
        }
      });
      setTotalCompras(latestPurchases); // Actualizar el estado de tsales con el valor obtenido
    };

    fetchData();
  }, []);

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

    // Calcular los totales de compras
    let comprasTotal = 0;

    filtered.forEach((item) => {
      comprasTotal += item.total; // Asumiendo que el campo es "total" para compras
    });
    // Establecer los totales en los estados correspondientes
    setTotalCompras(comprasTotal);

    setFilteredData(filtered);
  };

  return (
    <div className="container mx-auto p-10 justify-center items-center h-full">
      <h1 className=" text-2xl font-semibold text-center">
        HISTORIAL DE CLIENTES
      </h1>
      <div>
        <Estados totalCompras={totalCompras} />
      </div>
      <div className="container mx-auto p-4 justify-center items-center h-screen">
        <FilterSection onFilter={applyFilter} />
        <ReusableTable data={filteredData} columns={columns} />
      </div>
    </div>
  )
}

export default ConsultasClientes;