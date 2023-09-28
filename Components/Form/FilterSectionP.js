import React, { useState, useCallback } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SearchIcon } from './SearchIcon';
import {
  Input,
  Pagination,
  
} from "@nextui-org/react";



const FilterSection = ({ onFilter }) => {

  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [filterValues, setFilterValue] = useState('');
  const [applyFilterClicked, setApplyFilterClicked] = useState(false); // Agrega esta línea para definir setApplyFilterClicked

  
  const [page, setPage] = React.useState(1);

  const handleFilterChange = (value) => {
    setFilterValue(value);
    onFilter(value, fechaDesde, fechaHasta); // Llama a onFilter cuando cambia el valor del filtro
  };

  const handleFechaDesdeChange = (date) => {
    console.log("Fecha Desde seleccionada:", date);
    setFechaDesde(date);
  };
  
  const handleFechaHastaChange = (date) => {
    console.log("Fecha Hasta seleccionada:", date);
    setFechaHasta(date);
  };

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);



  const handleApplyFilters = () => {
    // Asegúrate de que fechaDesde y fechaHasta tengan valores antes de llamar a onFilter
    if (fechaDesde && fechaHasta) {
      setApplyFilterClicked(true);
      onFilter(filterValues, fechaDesde, fechaHasta);
      console.log('fecha desde', fechaDesde);
      console.log('fecha hasta', fechaHasta);
    } else {
      // Puedes mostrar un mensaje de error o realizar alguna acción adecuada si las fechas no están configuradas
      console.log("Por favor, seleccione ambas fechas antes de aplicar los filtros.");
    }
  };
  

  return (
    <div>
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        startContent={<SearchIcon />}
        type="text"
        placeholder="Filtrar por RTN"
        value={filterValues}
        onChange={e => handleFilterChange(e.target.value)}
      />

        <DatePicker
          label="Fecha Desde"
          placeholderText="Fecha Desde"
          selected={fechaDesde}
          onChange={handleFechaDesdeChange}
          dateFormat="dd/MM/yyyy"
          isClearable
          popperPlacement="bottom-end"
        />
        <DatePicker
          label="Fecha Hasta"
          placeholderText="Fecha Hasta"
          selected={fechaHasta}
          onChange={handleFechaHastaChange}
          dateFormat="dd/MM/yyyy"
          isClearable
          popperPlacement="bottom-end"
        />
        <button
          className="btn btn-primary"
          onClick={handleApplyFilters}
          type='submit'
        >
          Aplicar Filtros
        </button>
      
    </div>


  );
};

export default FilterSection;
