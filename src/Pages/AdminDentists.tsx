import React, { useEffect, useState } from 'react';
import { getAllDentists, updateDentistStatus, deleteDentist } from '../api/admin';
import type { DentistForAdmin } from '../interfaces';
import '../styles/AdminDentists.css';

const AdminDentistsPanel: React.FC = () => {
  const [dentists, setDentists] = useState<DentistForAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDentists();
  }, []);

  const loadDentists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDentists();
      setDentists(data);
    } catch (error) {
      console.error('Error loading dentists:', error);
      setError('Ошибка загрузки списка врачей');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    dentistId: number,
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    try {
      await updateDentistStatus(dentistId, status);
      // Reload dentists list
      loadDentists();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Ошибка обновления статуса');
    }
  };

  const handleDelete = async (dentistId: number, dentistName: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить врача "${dentistName}"?`)) {
      try {
        await deleteDentist(dentistId);
        loadDentists();
      } catch (error) {
        console.error('Error deleting dentist:', error);
        setError('Ошибка удаления врача');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      approved: { text: 'Одобрен', class: 'status-approved' },
      pending: { text: 'Ожидает', class: 'status-pending' },
      rejected: { text: 'Отклонен', class: 'status-rejected' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, class: 'status-unknown' };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Загрузка списка врачей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div>{error}</div>
        <button onClick={loadDentists}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="admin-dentists-panel">
      <div className="admin-header">
        <h1>Управление Врачами</h1>
        <div className="admin-stats">
          <span>Всего врачей: {dentists.length}</span>
          <button onClick={loadDentists} className="refresh-btn">
            Обновить
          </button>
        </div>
      </div>

      {dentists.length === 0 ? (
        <div className="no-dentists">
          <p>Врачи не найдены</p>
        </div>
      ) : (
        <div className="dentists-table-container">
          <table className="dentists-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Специализация</th>
                <th>Клиника</th>
                <th>Опыт (лет)</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {dentists.map((dentist) => (
                <tr key={dentist.id}>
                  <td>{dentist.id}</td>
                  <td>{dentist.full_name}</td>
                  <td>{dentist.phone}</td>
                  <td>{dentist.email || '-'}</td>
                  <td>{dentist.specialization || '-'}</td>
                  <td>{dentist.clinic || '-'}</td>
                  <td>{dentist.experience_years || '-'}</td>
                  <td>{getStatusBadge(dentist.verification_status)}</td>
                  <td>
                    <div className="actions">
                      <select
                        value={dentist.verification_status}
                        onChange={(e) =>
                          handleStatusChange(
                            dentist.id,
                            e.target.value as 'approved' | 'rejected' | 'pending'
                          )
                        }
                        className="status-select"
                      >
                        <option value="pending">Ожидает</option>
                        <option value="approved">Одобрить</option>
                        <option value="rejected">Отклонить</option>
                      </select>
                      <button
                        onClick={() => handleDelete(dentist.id, dentist.full_name)}
                        className="delete-btn"
                        title="Удалить врача"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDentistsPanel;