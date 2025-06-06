import React, { useState, useEffect } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const res = await fetch('https://catalogo-api-i7nt.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: 'admin',
          password: '1234'
        })
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.access_token);
      } else {
        setError(data.detail || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de red');
    }
  };

  const getProductos = async (token) => {
    try {
      const res = await fetch('https://catalogo-api-i7nt.onrender.com/productos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    if (token) {
      getProductos(token);
    }
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Catálogo de Productos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.nombre} — Cantidad: {p.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

