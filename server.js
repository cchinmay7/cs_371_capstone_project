require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json()); // Middleware to parse JSON
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory


// Modified GET endpoint with GROUP BY
app.get('/api/iris', async (req, res) => {
  try {
    const query = `
      SELECT 
        species,
        COUNT(*) as count,
        ROUND(AVG(sepal_length)::numeric, 2) as avg_sepal_length,
        ROUND(AVG(sepal_width)::numeric, 2) as avg_sepal_width,
        ROUND(AVG(petal_length)::numeric, 2) as avg_petal_length,
        ROUND(AVG(petal_width)::numeric, 2) as avg_petal_width,
        ROUND(MIN(sepal_length)::numeric, 2) as min_sepal_length,
        ROUND(MAX(sepal_length)::numeric, 2) as max_sepal_length,
        ROUND(MIN(petal_length)::numeric, 2) as min_petal_length,
        ROUND(MAX(petal_length)::numeric, 2) as max_petal_length
      FROM iris
      GROUP BY species
      ORDER BY species`;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server error');
  }
});

// POST endpoint - insert data into the iris table
app.post('/api/iris', async (req, res) => {
  const { serial_number, sepal_length, sepal_width, petal_length, petal_width, species } = req.body;

  const query = `
    INSERT INTO iris (serial_number, sepal_length, sepal_width, petal_length, petal_width, species)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;

  const values = [serial_number, sepal_length, sepal_width, petal_length, petal_width, species];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server error');
  }
});

// PUT endpoint - update an existing record in the iris table
app.put('/api/iris/:serial_number', async (req, res) => {
  const { serial_number } = req.params;
  const { sepal_length, sepal_width, petal_length, petal_width, species } = req.body;

  const query = `
    UPDATE iris
    SET sepal_length = $1, sepal_width = $2, petal_length = $3, petal_width = $4, species = $5
    WHERE serial_number = $6
    RETURNING *`;

  const values = [sepal_length, sepal_width, petal_length, petal_width, species, serial_number];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      res.status(404).send('Iris record not found');
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server error');
  }
});

// DELETE endpoint - delete a record from the iris table
app.delete('/api/iris/:serial_number', async (req, res) => {
  const { serial_number } = req.params;

  const query = 'DELETE FROM iris WHERE serial_number = $1 RETURNING *';

  try {
    const result = await pool.query(query, [serial_number]);
    if (result.rowCount === 0) {
      res.status(404).send('Iris record not found');
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
