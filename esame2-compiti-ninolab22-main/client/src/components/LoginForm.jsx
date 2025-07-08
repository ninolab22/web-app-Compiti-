import { useState } from 'react';
import API from '../API/API.mjs';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await API.login({ username, password });
      onLogin(user);
    } catch {
      setError('Not valid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          minWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#2575fc', marginBottom: 0 }}>Accedi</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="login-email" style={{ color: '#444', fontWeight: 500 }}>Email</label>
          <input
            id="login-email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            style={{
              padding: '0.5rem',
              borderRadius: 6,
              border: '1px solid #bdbdbd',
              fontSize: 16
            }}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="login-password" style={{ color: '#444', fontWeight: 500 }}>Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{
              padding: '0.5rem',
              borderRadius: 6,
              border: '1px solid #bdbdbd',
              fontSize: 16
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 2px 8px rgba(37,117,252,0.08)'
          }}
        >
          Login
        </button>
        {error && (
          <div style={{
            color: '#fff',
            background: '#ff5252',
            borderRadius: 6,
            padding: '0.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );

}