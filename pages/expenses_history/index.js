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
} from "firebase/firestore";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import ReusableTable from "../../Components/Form/ReusableTable";
import { columns } from "../../Data/expenses_history/data";
import FilterSection from '../../Components/Form/FilterSectionGastos';
import { startOfDay, endOfDay } from 'date-fns';
import { parse, isAfter, isBefore } from "date-fns";

const InformeGastos = () => {
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

    const applyFilter = ({ type, startDate, endDate }) => {
        const filtered = data.filter((item) => {
            const itemDate = item.date.toDate();

            // Verifica si las fechas de inicio y fin están definidas
            const start = startDate ? startOfDay(startDate) : null;
            const end = endDate ? endOfDay(endDate) : null;

            // Comprueba si la fecha del elemento está dentro del rango (si se proporcionan fechas)
            const isWithinDateRange =
                (!start || isAfter(itemDate, start)) && (!end || isBefore(itemDate, end));

            return (
                item.type.toLowerCase().includes(type.toLowerCase()) && isWithinDateRange
            );
        });

        setFilteredData(filtered);
    };

    //traer datos de FireStore
    useEffect(() => {
        const fetchExpenses = async () => {
            const q = query(
                collection(db, "expenses"),
                orderBy('date', 'desc'));

            const querySnapshot = await getDocs(q);

            const expensesData = [];
            let indexs = 1;
            querySnapshot.forEach((doc) => {
                expensesData.push({ ...doc.data(), indexs: indexs++ });
            });
            setData(expensesData);
            setFilteredData(expensesData); // Inicializa los datos filtrados con los datos originales
        };
        fetchExpenses();

    }, []);

    return (<>
        <div>
            <Head>
                <title>GASTOS RECIENTES</title>
                <meta name="description" content="GASTOS RECIENTES" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/img/logo_paginas.png" />
            </Head>
            <h2 className="text-lg font-semibold mb-2 ">
                <p className='text-center'>
                    GASTOS RECIENTES
                </p>
            </h2>
            <FilterSection onFilter={applyFilter} />
            <ReusableTable data={filteredData} columns={columns} />
        </div>
    </>);

}

export default InformeGastos;