import React, { useState, useEffect } from 'react';
import { tasks, Task } from '../services/api';

interface TasksProps {
  userRole: 'sender' | 'client';
}

export default function Tasks({ userRole }: TasksProps) {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    map: {} as Record<string, number>
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = userRole === 'sender' 
        ? await tasks.getMyTasks()
        : await tasks.getActiveTasks();
      setTaskList(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tasks.create(newTask);
      setShowCreateForm(false);
      setNewTask({ name: '', description: '', map: {} });
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании задачи');
    }
  };

  const handleUpdateStatus = async (taskId: string, status: 'active' | 'archived') => {
    try {
      await tasks.updateTask(taskId, { status });
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении статуса');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await tasks.deleteTask(taskId);
        loadTasks();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка при удалении задачи');
      }
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="tasks-container">
      <h2>Задачи</h2>
      {error && <div className="error-message">{error}</div>}

      {userRole === 'sender' && (
        <button
          className="create-button"
          onClick={() => setShowCreateForm(true)}
        >
          Создать задачу
        </button>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateTask} className="create-form">
          <div className="form-group">
            <label htmlFor="taskName">Название:</label>
            <input
              id="taskName"
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Введите название задачи"
              aria-label="Название задачи"
            />
          </div>

          <div className="form-group">
            <label htmlFor="taskDescription">Описание:</label>
            <textarea
              id="taskDescription"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Введите описание задачи"
              aria-label="Описание задачи"
            />
          </div>

          <div className="form-group">
            <label>Карта задачи:</label>
            {/* Здесь будет компонент для создания карты */}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Создать</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowCreateForm(false)}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="task-list">
        {taskList.map(task => (
          <div key={task._id} className="task-card">
            <h3>{task.name}</h3>
            {task.description && <p>{task.description}</p>}
            <div className="task-meta">
              <span>Создано: {new Date(task.createdAt).toLocaleDateString()}</span>
              <span>Статус: {task.status}</span>
            </div>
            
            {userRole === 'sender' && (
              <div className="task-actions">
                <button
                  onClick={() => handleUpdateStatus(
                    task._id,
                    task.status === 'active' ? 'archived' : 'active'
                  )}
                >
                  {task.status === 'active' ? 'Архивировать' : 'Активировать'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="delete-button"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 