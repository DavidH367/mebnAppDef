import React, { useState, useEffect } from "react";
import "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
  where,
} from "firebase/firestore";
import ReusableTable from "../../Components/Form/ReusableTable";
import FilterSection from "../../Components/Form/FilterSectionInv";

import { columns } from "../../Data/inventory_control/datas";
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

  //stados iniciales de stats
  const [tsales, setTsales] = useState(0); // Definir tsales en el estado inicial
  const [tpurchases, setPurchases] = useState(0); // Definir tsales en el estado inicial

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
  //actualizar totales
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalCompras, setTotalCompras] = useState(0);
  //inicializar datos de stats
  useEffect(() => {
    //suma de total en ventas
    const fetchData = async () => {
      
      const querySnapshot1 = await getDocs(
        query(collection(db, "inventories"), where("tran_type", "==", "VENTA"))
      );
      let latestTsales = 0;
      querySnapshot1.forEach((doc) => {
        const data = doc.data();
        // Asegúrate de que la propiedad 'value' exista en el documento
        if (data.hasOwnProperty("value")) {
          latestTsales += data.value; // Suma el valor de 'value' al total
        }
      });

      //suma total de compras
      const querySnapshot2 = await getDocs(
        query(collection(db, "inventories"), where("tran_type", "==", "COMPRA"))
      );
      let latestPurchases = 0;
      querySnapshot2.forEach((doc) => {
        const data = doc.data();
        // Asegúrate de que la propiedad 'value' exista en el documento
        if (data.hasOwnProperty("value")) {
          latestPurchases += data.value; // Suma el valor de 'value' al total
        }
      });

      setTotalVentas(latestTsales);
      setTotalCompras(latestPurchases); // Actualizar el estado de tsales con el valor obtenido
    };

    fetchData();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  

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

  const applyFilter = ({ rtn, coffee_type, startDate, endDate }) => {
    const filtered = data.filter((item) => {
      const itemDate = item.date.toDate();
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);

      return (
        item.rtn.toLowerCase().includes(rtn.toLowerCase()) &&
        item.coffee_type.toLowerCase().includes(coffee_type.toLowerCase()) &&
        (!startDate || itemDate >= start) &&
        (!endDate || itemDate <= end)
      );
    });

    // Calcular los totales de ventas y compras
    let ventasTotal = 0;
    let comprasTotal = 0;

    filtered.forEach((item) => {
      if (item.tran_type === 'VENTA') {
        ventasTotal += item.value; // Asumiendo que el campo es "amount" para ventas
      } else if (item.tran_type === 'COMPRA') {
        comprasTotal += item.value; // Asumiendo que el campo es "amount" para compras
      }
    });
    // Establecer los totales en los estados correspondientes
    setTotalVentas(ventasTotal);
    setTotalCompras(comprasTotal);

    setFilteredData(filtered);
  };

  return (
    <div className="espacio">
      <div className="container mx-auto p-10 justify-center items-center h-full">
        <h1 className=" text-2xl font-semibold text-center mb-5">
          CONTROL DE INVENTARIO Y GASTOS DE CAFÉ
        </h1>
        <div>
          <Estados totalVentas={totalVentas} totalCompras={totalCompras} />
        </div>
        <div>
          <div className="container mx-auto p-4 justify-center items-center h-screen">
            <FilterSection onFilter={(filterValues) => applyFilter(filterValues)} />
            <ReusableTable data={filteredData} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeControl;
