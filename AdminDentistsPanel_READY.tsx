// Готовый компонент админ панели для управления врачами
// Сохраните как: src/Pages/AdminDentistsPanel.tsx

import React, { useEffect, useState } from 'react';
import { getAllDentists, updateDentistVerification } from '../api/admin';
import { DentistForAdmin } from '../interfaces';
import './AdminDentistsPanel.css';

const AdminDentistsPanel: React.FC = () => {
  const [dentists, setDentists] = useState<DentistForAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const limit = 20;

  useEffect(() => {
    loadDentists();
  }, [page, filter]);

  const loadDentists = async () => {
    try {
      setLoading(true);
      const data = await getAllDentists(page * limit, limit);
      
      // Фильтрация на клиенте (можно перенести на сервер)
      let filtered = data.dentists;
      if (filter !== 'all') {
        filtered = data.dentists.filter(d => d.verification_status === filter);
      }
      
      setDentists(filtered);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading dentists:', error);
      alert('Ошибка загрузки списка врачей');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationChange = async (
    dentistId: number,
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    if (!confirm(`Вы уверены, что хотите изменить статус на "${status}"?`)) {
      return;
    }

    try {
      await updateDentistVerification(dentistId, status);
      alert('Статус успешно обновлен');
      loadDentists();
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { text: 'Одобрен', class: 'status-approved' },
      pending: { text: 'Ожидает', class: 'status-pending' },
      rejected: { text: 'Отклонен', class: 'status-rejected' }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="admin-panel-loading">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="admin-dentists-panel">
      <div className="panel-header">
        <h1>Управление Врачами</h1>
        <div className="panel-stats">
          <div className="stat-card">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Всего врачей</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {dentists.filter(d => d.verification_status === 'pending').length}
            </span>
            <span className="stat-label">Ожидают проверки</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {dentists.filter(d => d.verification_status === 'approved').length}
            </span>
            <span className="stat-label">Одобрено</span>
          </div>
        </div>
      </div>

      <div className="panel-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Ожидают
        </button>
        <button
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          Одобренные
        </button>
        <button
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Отклоненные
        </button>
      </div>

      <div className="dentists-grid">
        {dentists.map((dentist) => (
          <div key={dentist.id} className="dentist-card">
            <div className="card-header">
              <div className="dentist-info">
                <h3>{dentist.full_name}</h3>
                <p className="dentist-id">ID: {dentist.id}</p>
              </div>
              {getStatusBadge(dentist.verification_status)}
            </div>

            <div className="card-body">
              <div className="info-row">
                <span className="label">Телефон:</span>
                <span className="value">{dentist.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{dentist.email || '-'}</span>
              </div>
              <div className="info-row">
                <span className="label">Специализация:</span>
                <span className="value">{dentist.specialization || '-'}</span>
              </div>
              <div className="info-row">
                <span className="label">Клиника:</span>
                <span className="value">{dentist.clinic || '-'}</span>
              </div>
              <div className="info-row">
                <span className="label">Опыт:</span>
                <span className="value">
                  {dentist.experience_years ? `${dentist.experience_years} лет` : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Возраст:</span>
                <span className="value">{dentist.age || '-'}</span>
              </div>

              <div className="stats-section">
                <h4>Статистика</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{dentist.stats.total_appointments}</span>
                    <span className="stat-text">Всего приемов</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{dentist.stats.completed_appointments}</span>
                    <span className="stat-text">Завершено</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{dentist.stats.pending_appointments}</span>
                    <span className="stat-text">Ожидает</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <select
                value={dentist.verification_status}
                onChange={(e) =>
                  handleVerificationChange(
                    dentist.id,
                    e.target.value as 'approved' | 'rejected' | 'pending'
                  )
                }
                className="verification-select"
              >
                <option value="pending">Ожидает проверки</option>
                <option value="approved">Одобрить</option>
                <option value="rejected">Отклонить</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {dentists.length === 0 && (
        <div className="empty-state">
          <p>Врачи не найдены</p>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="pagination-btn"
        >
          ← Назад
        </button>
        <span className="pagination-info">
          Страница {page + 1} из {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={(page + 1) * limit >= total}
          className="pagination-btn"
        >
          Вперед →
        </button>
      </div>
    </div>
  );
};

export default AdminDentistsPanel;
