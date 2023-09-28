import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import ReusableTable from '../../Components/Form/ReusableTable';
import FilterSectionComponent from '../../Components/Form/FilterSectionS'; // Asegúrate de ajustar la ruta correcta
import { columns, tipoC } from './datas';
import { Input, Select, SelectItem } from '@nextui-org/react';
import NavBar from '../../Components/Layout/NavBar';

const salesRef = collection(db, 'sales');
const invRef = collection(db, 'inventories');


const ConsultaVentas = () => {
    <div>
    <div className="grid h-80 card bg-base-200 rounded-box place-items-top flex-grow">
        <h1 className="text-2xl font-semibold mb-4 " >
            <p className='text-center'>
                INFORMACION DE VENTAS
            </p>
        </h1>
        <FilterSectionComponent onFilter={applyFilter} />
        <ReusableTable data={filteredData} columns={columns} />
    </div>
</div>

};
export default ConsultaVentas;