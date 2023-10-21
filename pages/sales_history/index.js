import React, { useState, useEffect } from "react";
import Head from "next/head";
import "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import ReusableTable from "../../Components/Form/ReusableTable";
import FilterSection from "../../Components/Form/FilterSectionP"; // Asegúrate de ajustar la ruta correcta
import { columns, tipoC } from "../../Data/sales_history/datas";
import { startOfDay, endOfDay } from "date-fns";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import Estados from "@/Components/Form/statsV";

const ConsultaVentas = () => {
  const [totalVentas, setTotalVentas] = useState(0);
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

  //actualizar totales

  useEffect(() => {
    //suma de total en ventas
    const fetchData = async () => {
      const querySnapshot1 = await getDocs(
        query(collection(db, "sales"), orderBy("date", "desc"))
      );
      let latestTsales = 0;
      querySnapshot1.forEach((doc) => {
        const data = doc.data();
        // Asegúrate de que la propiedad 'value' exista en el documento
        if (data.hasOwnProperty("total")) {
          latestTsales += data.total; // Suma el valor de 'value' al total
        }
      });
      setTotalVentas(latestTsales);
    };

    fetchData();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

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

    // Calcular los totales de ventas y compras
    let ventasTotal = 0;

    filtered.forEach((item) => {
      ventasTotal += item.total; // Asumiendo que el campo es "total" para ventas
    });
    // Establecer los totales en los estados correspondientes
    setTotalVentas(ventasTotal);

    setFilteredData(filtered);
  };

  return (
    <div className="container mx-auto p-10 justify-center items-center h-full">
      <Head>
        <title>HISTORIAL DE VENTAS</title>
        <meta name="description" content="HISTORIAL DE VENTAS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <h1 className=" text-2xl font-semibold text-center">
        HISTORIAL DE VENTAS
      </h1>
      <div>
        <Estados totalVentas={totalVentas} />
      </div>

      <div className="container mx-auto p-4 justify-center items-center h-screen">
        <FilterSection onFilter={applyFilter} />
        <ReusableTable data={filteredData} columns={columns} />
      </div>
    </div>
  );
};

export default ConsultaVentas;
