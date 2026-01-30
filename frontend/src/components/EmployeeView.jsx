import React from 'react';

function EmployeeView({ employee, onClose }) {
  if (!employee) {
    return null;
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format salary with Indian Rupee symbol
  const formatSalary = (salary) => {
    if (!salary) return '-';
    return `₹${parseFloat(salary).toLocaleString('en-IN')}`;
  };

  return (
    <div className="employee-view">
      <div className="view-header">
        <h2>Employee Details</h2>
        <button onClick={onClose} className="btn btn-secondary">
          Back to List
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{employee.id}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{employee.name}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{employee.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Position:</span>
          <span className="detail-value">{employee.position || '-'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Department:</span>
          <span className="detail-value">{employee.department || '-'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Salary:</span>
          <span className="detail-value">{formatSalary(employee.salary)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">{formatDate(employee.created_at)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Updated At:</span>
          <span className="detail-value">{formatDate(employee.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeView;
