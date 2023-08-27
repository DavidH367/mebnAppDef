import React, { useState } from 'react';


const FilterSection = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    zona: '',
    nombre: '',
    fechaDesde: null,
    fechaHasta: null,
    // Agrega más campos de filtro según tus columnas
  });

  const handleFilterChange = (column, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters); // Verifica si los filtros se están capturando correctamente
    onFilter(filters);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filtrar por ZONA"
        value={filters.zona}
        onChange={e => handleFilterChange('zona', e.target.value)}
      />
      <input
        type="text"
        placeholder="Filtrar por NOMBRE"
        value={filters.nombre}
        onChange={e => handleFilterChange('nombre', e.target.value)}
      />
      
      <button onClick={handleApplyFilters}>Consultar</button>
    </div>
  );
};

export default FilterSection;
