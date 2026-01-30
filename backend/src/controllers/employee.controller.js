const pool = require('../db');
const { AppError } = require('../utils/errorHandler');

/**
 * Employee Controller
 * 
 * Handles all CRUD operations for employees
 * All queries use parameterized SQL to prevent SQL injection
 */

/**
 * GET /employees
 * Get all active employees with pagination and search
 */
const getAllEmployees = async (req, res, next) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Base query for active employees
    let countQuery = 'SELECT COUNT(*) FROM employees WHERE is_active = true';
    let dataQuery = `
      SELECT id, name, email, position, department, salary, created_at, updated_at
      FROM employees
      WHERE is_active = true
    `;

    const queryParams = [];

    // Add search filter if provided
    if (search) {
      const searchFilter = ` AND (
        name ILIKE $1 OR 
        email ILIKE $1 OR 
        position ILIKE $1 OR 
        department ILIKE $1
      )`;
      
      countQuery += searchFilter;
      dataQuery += searchFilter;
      queryParams.push(`%${search}%`);
    }

    // Add pagination
    dataQuery += ` ORDER BY id DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    // Execute queries
    const countResult = await pool.query(
      countQuery,
      search ? [`%${search}%`] : []
    );
    const dataResult = await pool.query(dataQuery, queryParams);

    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        limit: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /employees/:id
 * Get single active employee by ID
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, name, email, position, department, salary, created_at, updated_at
      FROM employees
      WHERE id = $1 AND is_active = true
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new AppError('Employee not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /employees
 * Create new employee
 */
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, position, department, salary } = req.body;

    // Validate required fields
    if (!name || !email) {
      throw new AppError('Name and email are required', 400);
    }

    // Check for duplicate email
    const checkQuery = 'SELECT id FROM employees WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      throw new AppError('Email already exists', 409);
    }

    // Insert new employee
    const insertQuery = `
      INSERT INTO employees (name, email, position, department, salary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, position, department, salary, is_active, created_at, updated_at
    `;

    const result = await pool.query(insertQuery, [
      name,
      email,
      position || null,
      department || null,
      salary || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /employees/:id
 * Update existing employee
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, position, department, salary } = req.body;

    // Check if employee exists and is active
    const checkQuery = 'SELECT id FROM employees WHERE id = $1 AND is_active = true';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new AppError('Employee not found', 404);
    }

    // If email is being updated, check for duplicates
    if (email) {
      const emailCheckQuery = 'SELECT id FROM employees WHERE email = $1 AND id != $2';
      const emailCheckResult = await pool.query(emailCheckQuery, [email, id]);

      if (emailCheckResult.rows.length > 0) {
        throw new AppError('Email already exists', 409);
      }
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (position !== undefined) {
      updates.push(`position = $${paramCount++}`);
      values.push(position);
    }
    if (department !== undefined) {
      updates.push(`department = $${paramCount++}`);
      values.push(department);
    }
    if (salary !== undefined) {
      updates.push(`salary = $${paramCount++}`);
      values.push(salary);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const updateQuery = `
      UPDATE employees
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, position, department, salary, is_active, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /employees/:id
 * Soft delete employee (set is_active = false)
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const checkQuery = 'SELECT id, is_active FROM employees WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new AppError('Employee not found', 404);
    }

    if (!checkResult.rows[0].is_active) {
      throw new AppError('Employee already deleted', 400);
    }

    // Soft delete: set is_active to false
    const deleteQuery = `
      UPDATE employees
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;

    await pool.query(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
