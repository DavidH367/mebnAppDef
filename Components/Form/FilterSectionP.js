import React, { useState } from "react";
import { SearchIcon } from "./SearchIcon";
import { Input } from "@nextui-org/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@nextui-org/react";

const FilterSection = ({ onFilter }) => {
  const [filterValues, setFilterValues] = useState({
    rtn: "",
    startDate: null,
    endDate: null,
  });

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
      rtn: "",
      startDate: null,
      endDate: null,
    });
    onFilter({
      rtn: "",
      startDate: null,
      endDate: null,
    }); // Aplicar el filtro vacío
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
        onChange={(e) => handleFilterChange("rtn", e.target.value)}
      />
      <div className="mt-2 mb-2">
        <DatePicker
          selected={filterValues.startDate}
          onChange={(date) => handleFilterChange("startDate", date)}
          placeholderText="Fecha de inicio"
          dateFormat="dd/MM/yyyy"
          className="border rounded px-2 py-1 mr-2"
        />
        <DatePicker
          selected={filterValues.endDate}
          onChange={(date) => handleFilterChange("endDate", date)}
          placeholderText="Fecha de fin"
          dateFormat="dd/MM/yyyy"
          className="border rounded px-2 py-1"
        />
        <Button
          color="primary"
          variant="shadow"
          onClick={applyFilter}
          className="btn btn-primary ml-2"
        >
          BUSCAR
        </Button>
        <Button
          color="primary"
          variant="shadow"
          onClick={clearFilters}
          className="btn btn-secondary ml-2"
        >
          LIMPIAR
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
