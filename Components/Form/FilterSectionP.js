import React, { useState } from "react";
import { SearchIcon } from "./SearchIcon";
import { Input } from "@nextui-org/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";


const FilterSection = ({ onFilter }) => {
  const [filterValues, setFilterValues] = useState({
    rtn: "",
    startDate: null,
    endDate: null,
    coffee_type: "", // Nuevo campo para el tipo de café
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
      coffee_type: "", // Nuevo campo para el tipo de café
    });
    onFilter({
      rtn: "",
      startDate: null,
      endDate: null,
      coffee_type: "", // Nuevo campo para el tipo de café
    }); // Aplicar el filtro vacío

  };

  const tipoC = [
    { label: "Requema", value: "Requema" },
    { label: "Café en Uva", value: "Café en Uva" },
    { label: "Pergamino Humedo", value: "Pergamino Humedo" },
    { label: "Pergamino Mojado", value: "Pergamino Mojado" },
  ];

  return (
    <div>
      <div className="mt-2 mb-2">
        <Select
          isRequired
          size='sm'
          id="coffee_type"
          label="Tipo Café"
          placeholder="Seleccione Tipo de Café"
          autoComplete="coffee_type"
          value={filterValues.coffee_type} // Valor del campo "Tipo de Café"
          onChange={(e) => handleFilterChange("coffee_type", e.target.value)} // Actualiza "tipoCafe" en el estado
          className="max-w-xs"
        >
          {tipoC.map((coffee_type) => (
            <SelectItem key={coffee_type.value} value={coffee_type.value}>
              {coffee_type.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="mt-2 mb-2 width80">
        <Input
          className="w-full sm:max-w-[100%]"
          startContent={<SearchIcon />}
          type="text"
          placeholder="Filtrar por RTN"
          value={filterValues.rtn}
          onChange={(e) => handleFilterChange("rtn", e.target.value)}
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
