import React, { useState, useCallback } from 'react';
import { SearchIcon } from './SearchIcon';
import {
  Input,
  Pagination,
} from "@nextui-org/react";

const FilterSection = ({ onFilter }) => {
  const [page, setPage] = React.useState(1);
  const [filterValues, setFilterValue] = useState(''); // Almacena los valores de filtro para cada columna

  const handleFilterChange = (value) => {
    setFilterValue(value);
    onFilter(value);
  };

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const [filters, setFilters] = useState({
    zona: '',
    nombre: '',
    fechaDesde: null,
    fechaHasta: null,
    // Agrega más campos de filtro según tus columnas
  });


  const handleApplyFilters = () => {
    console.log("Applying filters:", filters); // Verifica si los filtros se están capturando correctamente
    onFilter(filters);
  };

  return (
    <div>
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        startContent={<SearchIcon />}
        type="text"
        placeholder="Filtrar por Nombre"
        value={filterValues}
        onChange={e => handleFilterChange(e.target.value)}
      />
    </div>
  );
};

export default FilterSection;