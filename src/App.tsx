import React, { useState, useEffect } from 'react';
import { auth } from './services/api';
import type { User } from './services/api';
import Auth from './components/Auth';
import Tasks from './components/Tasks';
import Comparisons from './components/Comparisons';
import CardsApp from './CardsApp';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'cards' | 'tasks' | 'comparisons'>('auth');
  const [personalityMap, setPersonalityMap] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await auth.getMe();
        setUser(userData);
        setPersonalityMap(userData.personalityMap || null);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleAuth = async (token: string) => {
    const userData = await auth.getMe();
    setUser(userData);
    setPersonalityMap(userData.personalityMap || null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPersonalityMap(null);
    setCurrentScreen('auth');
  };

  // Обновление карты личности в state после заполнения
  const handlePersonalityMapUpdate = (map: Record<string, number>) => {
    setPersonalityMap(map);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Карта личности и карта задачи</h1>
        <div className="user-info">
          <span>{user.name}</span>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={currentScreen === 'cards' ? 'active' : ''}
          onClick={() => setCurrentScreen('cards')}
        >
          Карта личности
        </button>
        <button
          className={currentScreen === 'tasks' ? 'active' : ''}
          onClick={() => setCurrentScreen('tasks')}
        >
          Задачи
        </button>
        <button
          className={currentScreen === 'comparisons' ? 'active' : ''}
          onClick={() => setCurrentScreen('comparisons')}
        >
          Сравнения
        </button>
      </nav>

      <main className="app-main">
        {currentScreen === 'cards' && <CardsApp initialPersonalityMap={personalityMap} onPersonalityMapUpdate={handlePersonalityMapUpdate} />}
        {currentScreen === 'tasks' && <Tasks userRole={user.role} />}
        {currentScreen === 'comparisons' && <Comparisons userRole={user.role} />}
      </main>
    </div>
  );
}

export default App;
