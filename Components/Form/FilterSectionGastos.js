import React, { useState } from "react";
import { SearchIcon } from "./SearchIcon";
import { Input } from "@nextui-org/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@nextui-org/react";

const FilterSection = ({ onFilter }) => {
  const [filterValues, setFilterValues] = useState({
    type: "",
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
      type: "",
      startDate: null,
      endDate: null,
    });
    onFilter({
      type: "",
      startDate: null,
      endDate: null,
    }); // Aplicar el filtro vacío
  };

  return (
    <div>
      <div className="mt-2 mb-2 width80">
        <Input
          className="w-full sm:max-w-[100%]"
          startContent={<SearchIcon />}
          type="text"
          placeholder="Filtrar por TIPO"
          value={filterValues.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        />
      </div>
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
      </div>
      <div className="mt-2 mb-2">
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
