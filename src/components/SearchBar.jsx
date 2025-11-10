import { useState } from 'react';
import './SearchBar.css';

/*
 * Barra de busqueda de ciudades
 *
 * - Permite al usuario escribir el nombre de una ciudad
 * - Al enviar el formulario, llama a `onSearch` con el valor ingresado
 * - Limpia el input despues de cada busqueda exitosa
 *
 *  onSearch callback que recibe la ciudad a buscar
 */

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ciudad..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </div>
    </form>
  );
}

export default SearchBar;