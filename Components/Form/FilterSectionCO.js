import React, { useState, useCallback } from 'react';
import { SearchIcon } from './SearchIcon';
import {
  Input,
  Pagination,
} from "@nextui-org/react";
import DatePicker from "react-datepicker";
import { parse, isAfter, isBefore } from "date-fns";
import { startOfDay, endOfDay } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import {Button} from "@nextui-org/react";


const FilterSection = ({ onFilter }) => {

    //estados para las fechas de inicio y fin
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredDataf, setFilteredDataf] = useState([]);
    const [data, setData] = useState([]);


  const [page, setPage] = React.useState(1);
  const [filterValues, setFilterValues] = useState({
    rtn: '',
    n_check: '',
    startDate: null,
    endDate: null,
  });

  //const handleFilterChange = (value) => {
   // setFilterValues(value);
   // onFilter(value, startDate, endDate);
 // };

  const handleFilterChange = (key, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const applyFilter = () => {
    onFilter(filterValues);
  };

  const clearFilters = () => {
    setFilterValues({
      rtn: '',
      n_check: '',
      startDate: null,
      endDate: null,
    });
    onFilter({ rtn: '', n_check: '', startDate: null, endDate: null }); // Aplicar el filtro vacío
  };


  return (
    <div>
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        startContent={<SearchIcon />}
        type="text"
        placeholder="Filtrar por RTN"
        value={filterValues.rtn}
        onChange={(e) => handleFilterChange('rtn', e.target.value)}
      />
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        startContent={<SearchIcon />}
        type="text"
        placeholder="Filtrar por N° Cheque"
        value={filterValues.n_check}
        onChange={(e) => handleFilterChange('n_check', e.target.value)}
      />
      <DatePicker
        selected={filterValues.startDate}
        onChange={(date) => handleFilterChange('startDate', date)}
        placeholderText="Fecha de inicio"
        dateFormat="dd/MM/yyyy"
        className="border rounded px-2 py-1 mr-2"
        
      />

      <DatePicker
        selected={filterValues.endDate}
        onChange={(date) => handleFilterChange('endDate', date)}
        placeholderText="Fecha de fin"
        dateFormat="dd/MM/yyyy"
        className="border rounded px-2 py-1"
        
      />
      <Button 
        color="primary" 
        variant="shadow" 
        onClick={applyFilter} 
        className="btn btn-primary ml-2">
          BUSCAR
      </Button>
      <Button 
      color="primary" 
      variant="shadow"
      onClick={clearFilters} className="btn btn-secondary ml-2"> 
        LIMPIAR 
      </Button>
    </div>
  );
};

export default FilterSection;