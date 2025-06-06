import React, { useState, useEffect, useCallback } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = useCallback(async () => {
    try {
      const res = await fetch('https://catalogo-api-i7nt.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
        username,
        password
        })
      });

      const data = await res.json();
      if (res.ok) {
          localStorage.setItem("token", data.access_token);
          setToken(data.access_token);
          setError('');
      }
    } catch (err) {
      setError('Error de red');
    }
}, [username, password]);

  const getProductos = useCallback(async (tok) => {
    try {
      const res = await fetch("https://catalogo-api-i7nt.onrender.com/productos", {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        login();
        return;
      }
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  }, [login]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      getProductos(storedToken);
    }
  }, [getProductos]);

return (
  <div style={{ padding: '2rem' }}>
   {!token ? (
      // 🔐 FORMULARIO DE LOGIN
      <form onSubmit={(e) => { e.preventDefault(); login(); }}>
        <h2>Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    ) : (
      // 🛍️ CATÁLOGO DE PRODUCTOS
      <>
        <h1>Catálogo de Productos</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {productos.map((p) => (
            <li key={p.id}>
              {p.nombre} — Cantidad: {p.cantidad}
            </li>
          ))}
        </ul>
        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}>
          Cerrar sesión
        </button>
      </>
    )}
  </div>
);

}

export default App;
