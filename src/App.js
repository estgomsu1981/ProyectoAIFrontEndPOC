import React, { useState, useEffect, useCallback } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const login = useCallback(async () => {
    try {
      const res = await fetch('https://catalogo-api-i7nt.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: 'admin',
          password: '1234',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
      } else {
        setError(data.detail || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de red');
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('TOKEN ENCONTRADO:', storedToken);

    const getProductos = async (tok) => {
      try {
        const res = await fetch('https://catalogo-api-i7nt.onrender.com/productos', {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem('token');
          login();
          return;
        }
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos', err);
      }
    };

    if (storedToken) {
      setToken(storedToken);
      getProductos(storedToken);
    } else {
      console.log('No hay token en localStorage, se hará login');
      login();
    }
  }, [login]);

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
