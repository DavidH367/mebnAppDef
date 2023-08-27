//import React from 'react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
import FilterSection from './FilterSection'; // Importa el componente de filtro
import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';



const PurchasesTable = ({ purchases }) => {
  const [filteredPurchases, setFilteredPurchases] = useState(purchases);
  const [filters, setFilters] = useState({ zona: '', nombre: '' });

  useEffect(() => {
    applyFilters(filters); // Aplicar filtros cuando cambien
  }, [filters, purchases]); // Agrega 'purchases' al array de dependencias

  const applyFilters = ({ zona, nombre }) => {
    const lowerCaseZona = zona.toLowerCase();
    const lowerCaseNombre = nombre.toLowerCase();
  
    if (lowerCaseZona === '' && lowerCaseNombre === '') {
      setFilteredPurchases(purchases); // Mostrar todos los datos si no hay filtros
    } else {
      const filtered = purchases.filter(purchase => {
        const purchaseZona = purchase.zone.toLowerCase();
        const purchaseNombre = purchase.name.toLowerCase();
        
        return (
          purchaseZona.includes(lowerCaseZona) &&
          purchaseNombre.includes(lowerCaseNombre)
          // Agrega más condiciones según tus columnas
        );
      });
      setFilteredPurchases(filtered);
    }
  };

  const handleFilter = newFilters => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ zona: '', nombre: '' }); // Limpiar filtros
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded box-border border-4">
    <div className="p-4 sm:p-6 md:p-8">
      <FilterSection onFilter={handleFilter} onClearFilters={handleClearFilters}/> 
      <div className="overflow-x-auto">
        <Table isStriped aria-label="Example static collection table">
          <TableHeader>
            <TableColumn className="font-bold text-sm w-1/10">#</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">ZONA</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">NOMBRE</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">APELLIDO</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">TIPO DE CAFE</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">QUINTALES</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">PESO</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">FECHA</TableColumn>
            <TableColumn className="font-bold text-sm w-1/10">TOTAL</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((purchase, index) => (
              <TableRow key={purchase.Purchase_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{purchase.zone}</TableCell>
                <TableCell>{purchase.name}</TableCell>
                <TableCell>{purchase.last_name}</TableCell>
                <TableCell>{purchase.coffee_type}</TableCell>
                <TableCell>{purchase.bags}</TableCell>
                <TableCell>{purchase.weight}</TableCell>
                <TableCell>{purchase.date && purchase.date.toDate().toLocaleDateString()}</TableCell>
                <TableCell>{purchase.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
  );
};

export default PurchasesTable;
