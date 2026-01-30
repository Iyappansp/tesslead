const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employee.controller');

/**
 * Employee Routes
 * 
 * IMPORTANT: Authentication middleware is NOT applied here
 * It is applied GLOBALLY in app.js using: app.use("/employees", authMiddleware, employeeRoutes)
 */

// GET /employees - List all active employees with pagination and search
router.get('/', getAllEmployees);

// GET /employees/:id - Get single active employee
router.get('/:id', getEmployeeById);

// POST /employees - Create new employee
router.post('/', createEmployee);

// PUT /employees/:id - Update employee
router.put('/:id', updateEmployee);

// DELETE /employees/:id - Soft delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;
