import React, { useState, useEffect } from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import ErrorMessage from './components/ErrorMessage';
import { getEmployees, deleteEmployee } from './api/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees
  const fetchEmployees = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployees(page, limit, search);
      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(1, pagination.limit, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchEmployees(newPage, pagination.limit, searchTerm);
  };

  // Handle add employee
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteEmployee(id);
      fetchEmployees(pagination.currentPage, pagination.limit, searchTerm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEmployee(null);
    fetchEmployees(pagination.currentPage, pagination.limit, searchTerm);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <img src="/logo_tesslead.png  " alt="Tesslead Logo" className="header-logo" />
          <div className="header-text">
            <h1>Employee Dashboard</h1>
            <p>Manage your employees</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {!showForm ? (
          <>
            <div className="controls">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search by name, email, position, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-search">Search</button>
              </form>
              <button onClick={handleAddEmployee} className="btn btn-primary">
                Add Employee
              </button>
            </div>

            <EmployeeList
              employees={employees}
              loading={loading}
              pagination={pagination}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmployeeForm
            employee={editingEmployee}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </main>

      <footer className="footer">
        <p>tesslead © 2026 | iyaps | all rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
