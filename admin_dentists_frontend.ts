// Добавьте эти интерфейсы в src/interfaces/index.ts

export interface DentistStats {
  total_appointments: number;
  completed_appointments: number;
  pending_appointments: number;
}

export interface DentistForAdmin {
  id: number;
  user_id: number;
  full_name: string;
  email: string | null;
  phone: string;
  pinfl: string | null;
  diploma_number: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  specialization: string | null;
  address: string | null;
  clinic: string | null;
  age: number | null;
  experience_years: number | null;
  schedule: string | null;
  work_hours: string | null;
  telegram: string | null;
  instagram: string | null;
  whatsapp: string | null;
  works_photos: string | null;
  stats: DentistStats;
}

export interface DentistsListResponse {
  dentists: DentistForAdmin[];
  total: number;
  skip: number;
  limit: number;
}

// ============================================================
// Создайте новый файл: src/api/admin.ts
// ============================================================

import api from './api';
import { DentistForAdmin, DentistsListResponse } from '../interfaces';

// Get all dentists (with pagination)
export const getAllDentists = async (skip: number = 0, limit: number = 100) => {
  const response = await api.get<DentistsListResponse>(`/dentists?skip=${skip}&limit=${limit}`);
  return response.data;
};

// Get specific dentist by ID
export const getDentistById = async (dentistId: number) => {
  const response = await api.get<DentistForAdmin>(`/dentists/${dentistId}`);
  return response.data;
};

// Update dentist verification status
export const updateDentistVerification = async (
  dentistId: number,
  status: 'approved' | 'rejected' | 'pending'
) => {
  const response = await api.put(`/dentists/${dentistId}/verification`, {
    verification_status: status
  });
  return response.data;
};

// ============================================================
// Пример использования в React компоненте
// ============================================================

import React, { useEffect, useState } from 'react';
import { getAllDentists, updateDentistVerification } from '../api/admin';
import { DentistForAdmin } from '../interfaces';

const AdminDentistsPanel: React.FC = () => {
  const [dentists, setDentists] = useState<DentistForAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadDentists();
  }, [page]);

  const loadDentists = async () => {
    try {
      setLoading(true);
      const data = await getAllDentists(page * limit, limit);
      setDentists(data.dentists);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading dentists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationChange = async (
    dentistId: number,
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    try {
      await updateDentistVerification(dentistId, status);
      // Reload dentists list
      loadDentists();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-dentists-panel">
      <h1>Управление Врачами</h1>
      <p>Всего врачей: {total}</p>

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
            <th>Статистика</th>
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
              <td>
                <span className={`status-badge status-${dentist.verification_status}`}>
                  {dentist.verification_status === 'approved' && 'Одобрен'}
                  {dentist.verification_status === 'pending' && 'Ожидает'}
                  {dentist.verification_status === 'rejected' && 'Отклонен'}
                </span>
              </td>
              <td>
                <div className="stats">
                  <div>Всего: {dentist.stats.total_appointments}</div>
                  <div>Завершено: {dentist.stats.completed_appointments}</div>
                  <div>Ожидает: {dentist.stats.pending_appointments}</div>
                </div>
              </td>
              <td>
                <select
                  value={dentist.verification_status}
                  onChange={(e) =>
                    handleVerificationChange(
                      dentist.id,
                      e.target.value as 'approved' | 'rejected' | 'pending'
                    )
                  }
                >
                  <option value="pending">Ожидает</option>
                  <option value="approved">Одобрить</option>
                  <option value="rejected">Отклонить</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          Назад
        </button>
        <span>
          Страница {page + 1} из {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={(page + 1) * limit >= total}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default AdminDentistsPanel;

// ============================================================
// CSS стили (добавьте в ваш CSS файл)
// ============================================================

/*
.admin-dentists-panel {
  padding: 20px;
}

.dentists-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.dentists-table th,
.dentists-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.dentists-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dentists-table tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.stats {
  font-size: 12px;
}

.stats div {
  margin: 2px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:hover:not(:disabled) {
  background-color: #f4f4f4;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
*/
