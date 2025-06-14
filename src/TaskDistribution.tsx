import React, { useState, useEffect } from 'react';
import { personalityKeys } from './Professions';

interface TaskMap {
  id: string;
  name: string;
  map: Record<string, number>;
  owner: string;
}

interface ComparisonResult {
  taskId: string;
  taskName: string;
  personId: string;
  personName: string;
  results: {
    profession: string;
    pairs: [number, number, number];
  }[];
}

export default function TaskDistribution() {
  const [isSender, setIsSender] = useState(false);
  const [taskMaps, setTaskMaps] = useState<TaskMap[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskMap, setNewTaskMap] = useState<Record<string, number>>({});
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [personName, setPersonName] = useState('');

  // Загрузка сохраненных данных при монтировании
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskMaps');
    if (savedTasks) {
      setTaskMaps(JSON.parse(savedTasks));
    }
    const savedResults = localStorage.getItem('comparisonResults');
    if (savedResults) {
      setComparisonResults(JSON.parse(savedResults));
    }
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    localStorage.setItem('taskMaps', JSON.stringify(taskMaps));
  }, [taskMaps]);

  useEffect(() => {
    localStorage.setItem('comparisonResults', JSON.stringify(comparisonResults));
  }, [comparisonResults]);

  const handleAddTask = () => {
    if (!newTaskName || Object.keys(newTaskMap).length === 0) return;

    const newTask: TaskMap = {
      id: Date.now().toString(),
      name: newTaskName,
      map: newTaskMap,
      owner: 'sender' // В реальном приложении здесь будет ID отправителя
    };

    setTaskMaps([...taskMaps, newTask]);
    setNewTaskName('');
    setNewTaskMap({});
  };

  const handleCompare = () => {
    if (!selectedTask || !personName) return;

    const task = taskMaps.find(t => t.id === selectedTask);
    if (!task) return;

    // Получаем карту личности из localStorage
    const personalityMap = localStorage.getItem('lastUserMap');
    if (!personalityMap) {
      alert('Карта личности не найдена');
      return;
    }

    const userMap = JSON.parse(personalityMap);
    const results = compareMaps(userMap, task.map);

    const newResult: ComparisonResult = {
      taskId: task.id,
      taskName: task.name,
      personId: Date.now().toString(), // В реальном приложении здесь будет ID человека
      personName: personName,
      results: results
    };

    setComparisonResults([...comparisonResults, newResult]);
    setSelectedTask(null);
    setPersonName('');
  };

  const compareMaps = (userMap: Record<string, number>, taskMap: Record<string, number>) => {
    const results = [];
    for (const key of personalityKeys) {
      if (userMap[key] === 1 && taskMap[key] === -1) {
        results.push({ profession: key, pairs: [1, 0, 0] });
      } else if (userMap[key] === -1 && taskMap[key] === 1) {
        results.push({ profession: key, pairs: [0, 1, 0] });
      } else if (userMap[key] === 1 && taskMap[key] === 1) {
        results.push({ profession: key, pairs: [0, 0, 1] });
      }
    }
    return results;
  };

  if (isSender) {
    return (
      <div className="app-container">
        <h2>Управление задачами</h2>
        
        {/* Добавление новой задачи */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Добавить новую задачу</h3>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Название задачи"
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          <button
            className="next-button"
            onClick={handleAddTask}
            disabled={!newTaskName}
          >
            Добавить задачу
          </button>
        </div>

        {/* Список задач */}
        <div>
          <h3>Список задач</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Название</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {taskMaps.map(task => (
                <tr key={task.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      className="next-button"
                      onClick={() => {
                        // Здесь будет логика для отправки задачи
                        alert('Функция отправки будет реализована позже');
                      }}
                    >
                      Отправить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Результаты сравнений */}
        <div style={{ marginTop: '30px' }}>
          <h3>Результаты сравнений</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Задача</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Человек</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Результаты</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults.map(result => (
                <tr key={`${result.taskId}-${result.personId}`}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.taskName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.personName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      className="next-button"
                      onClick={() => {
                        // Здесь будет логика для просмотра детальных результатов
                        alert('Функция просмотра результатов будет реализована позже');
                      }}
                    >
                      Просмотреть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="next-button"
          style={{ marginTop: '30px' }}
          onClick={() => setIsSender(false)}
        >
          Выйти из режима отправителя
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>Сравнение с задачами</h2>
      
      {/* Выбор задачи для сравнения */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Выберите задачу для сравнения</h3>
        <select
          value={selectedTask || ''}
          onChange={(e) => setSelectedTask(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        >
          <option value="">Выберите задачу</option>
          {taskMaps.map(task => (
            <option key={task.id} value={task.id}>{task.name}</option>
          ))}
        </select>
      </div>

      {/* Ввод имени */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Введите ваше имя</h3>
        <input
          type="text"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Ваше имя"
          style={{ marginBottom: '10px', padding: '5px' }}
        />
      </div>

      {/* Кнопка сравнения */}
      <button
        className="next-button"
        onClick={handleCompare}
        disabled={!selectedTask || !personName}
      >
        Сравнить
      </button>

      <button
        className="next-button"
        style={{ marginTop: '30px' }}
        onClick={() => setIsSender(true)}
      >
        Режим отправителя
      </button>
    </div>
  );
} 