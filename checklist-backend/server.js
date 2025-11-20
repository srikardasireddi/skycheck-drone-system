const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'srikar@2002', // <--- MAKE SURE THIS MATCHES YOUR MYSQL WORKBENCH PASSWORD
    database: 'redwing_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// ================= ROUTES ================= //

// 1. GET ALL ITEMS
app.get('/api/checklist', (req, res) => {
    const sql = "SELECT * FROM checklist_items";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. ADD NEW ITEM
app.post('/api/checklist', (req, res) => {
    const { task_name, status, comments } = req.body;
    if (!task_name) {
        return res.status(400).json({ error: "Task name is required" });
    }
    const sql = "INSERT INTO checklist_items (task_name, status, comments) VALUES (?, ?, ?)";
    db.query(sql, [task_name, status || 'Pending', comments], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, task_name, status, comments });
    });
});

// 3. UPDATE ITEM
app.put('/api/checklist/:id', (req, res) => {
    const { id } = req.params;
    const { task_name, status, comments } = req.body;
    const sql = "UPDATE checklist_items SET task_name = ?, status = ?, comments = ? WHERE id = ?";
    db.query(sql, [task_name, status, comments, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item updated successfully" });
    });
});

// 4. DELETE ITEM
app.delete('/api/checklist/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM checklist_items WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item deleted successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});