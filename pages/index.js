
import dynamic from 'next/dynamic';

const NavBar = dynamic(
    // Utiliza una función anónima que retorna una promesa con el componente importado.
    () => import('../Components/Layout/NavBar'),
    // Establece la opción 'ssr' en 'false' para deshabilitar el pre-renderizado en el lado del servidor.
    { ssr: false }
  );

  const Home = () => (
    <div>
      <NavBar />
    </div>
  );

  export default Home;
