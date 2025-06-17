import React, { useState, useEffect } from 'react';
import { comparisons, Comparison, Task } from '../services/api';

interface ComparisonsProps {
  userRole: 'sender' | 'client';
  taskId?: string;
}

export default function Comparisons({ userRole, taskId }: ComparisonsProps) {
  const [comparisonList, setComparisonList] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComparisons();
  }, [taskId]);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      const data = taskId
        ? await comparisons.getTaskComparisons(taskId)
        : await comparisons.getMyComparisons();
      setComparisonList(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке сравнений');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (comparisonId: string, status: 'pending' | 'reviewed' | 'contacted') => {
    try {
      await comparisons.updateStatus(comparisonId, status);
      loadComparisons();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении статуса');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="comparisons-container">
      <h2>Сравнения</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="comparison-list">
        {comparisonList.map(comparison => (
          <div key={comparison._id} className="comparison-card">
            <div className="comparison-header">
              <h3>Задача: {comparison.task.name}</h3>
              <span className={`status status-${comparison.status}`}>
                {comparison.status}
              </span>
            </div>

            <div className="comparison-user">
              <p>Пользователь: {comparison.user.name}</p>
              <p>Email: {comparison.user.email}</p>
            </div>

            <div className="comparison-results">
              <h4>Результаты сравнения:</h4>
              {comparison.results.map((result, index) => (
                <div key={index} className="result-item">
                  <p>Профессия: {result.profession}</p>
                  <p>Пары: {result.pairs.join(', ')}</p>
                </div>
              ))}
            </div>

            {userRole === 'sender' && (
              <div className="comparison-actions">
                <select
                  value={comparison.status}
                  onChange={(e) => handleUpdateStatus(
                    comparison._id,
                    e.target.value as 'pending' | 'reviewed' | 'contacted'
                  )}
                  aria-label="Изменить статус"
                >
                  <option value="pending">Ожидает</option>
                  <option value="reviewed">Просмотрено</option>
                  <option value="contacted">Связались</option>
                </select>
              </div>
            )}

            <div className="comparison-meta">
              <span>Создано: {new Date(comparison.createdAt).toLocaleDateString()}</span>
              <span>Обновлено: {new Date(comparison.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 