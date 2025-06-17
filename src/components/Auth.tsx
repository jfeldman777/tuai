import React, { useState } from 'react';
import { auth } from '../services/api';

interface AuthProps {
  onAuth: (token: string) => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client' as 'client' | 'sender'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const { token } = await auth.login({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', token);
        onAuth(token);
      } else {
        const { token } = await auth.register(formData);
        localStorage.setItem('token', token);
        onAuth(token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Введите email"
            aria-label="Email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Введите пароль"
            aria-label="Пароль"
          />
        </div>

        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="name">Имя:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Введите имя"
                aria-label="Имя"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Роль:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                aria-label="Выберите роль"
              >
                <option value="client">Клиент</option>
                <option value="sender">Отправитель</option>
              </select>
            </div>
          </>
        )}

        <button type="submit" className="submit-button">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <button
        className="switch-button"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
} 