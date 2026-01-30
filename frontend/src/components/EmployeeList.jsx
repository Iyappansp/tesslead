import React from 'react';
import LoadingSpinner from './LoadingSpinner';

function EmployeeList({ employees, loading, pagination, onView, onEdit, onDelete, onPageChange }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <p>No employees found</p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position || '-'}</td>
              <td>{employee.department || '-'}</td>
              <td>{employee.salary ? `₹${parseFloat(employee.salary).toLocaleString()}` : '-'}</td>
              <td className="actions">
                <button
                  onClick={() => onView(employee)}
                  className="btn btn-view"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(employee)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing page {pagination.currentPage} of {pagination.totalPages} 
          ({pagination.totalRecords} total employees)
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="btn btn-pagination"
          >
            Previous
          </button>
          <span className="page-number">Page {pagination.currentPage}</span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="btn btn-pagination"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
