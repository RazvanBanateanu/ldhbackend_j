const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");
require('dotenv').config({path: './env/mysql.env'});

const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true
}

const pool = mysql.createPool(mysqlConfig);

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
}))

const port = 5000;

app.get('/', function (req, res) {
  res.send('WELCOME')
})

app.get('/create-table', function (req, res) {
  const sql = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      path VARCHAR(255),
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )  ENGINE=INNODB;
  `;
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ error: 'Error getting connection from pool' });
      return;
    }
    
    connection.query(sql, (queryErr, result) => {
      connection.release();
      if (queryErr) {
        console.error('Error creating table:', queryErr);
        res.status(500).json({ error: 'Error creating table' });
      } else {
        res.send("posts table created");
      }
    });
  });
});


app.get('/insert', function (req, res) {
  const title = "Optimization";
  const path = "/optimization";
  const content = "This is an example content.";

  const query = `INSERT INTO posts (title, path, content) VALUES (?, ?, ?)`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ error: 'Error getting connection from pool' });
      return;
    }

    connection.query(query, [title, path, content], (queryErr, result) => {
      connection.release();
      if (queryErr) {
        console.error('Error inserting into table:', queryErr);
        res.status(500).json({ error: 'Error inserting into table' });
      } else {
        res.send(`Values inserted into table`);
      }
    });
  });
});

app.get('/posts', function (req, res) {
  const query = "SELECT * FROM posts"; 

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ error: 'Error getting connection from pool' });
      return;
    }

    connection.query(query , (queryErr, result) => {
      connection.release();
      if (queryErr) {
        console.error('Error fetching posts:', queryErr);
        res.status(500).json({ error: 'Error fetching posts:' });
      } else {
        res.send(result);
      }
    });
  });
});

app.get(`/posts/:postId`, function (req, res) {
  const postId = req.params.postId;
  const query = "SELECT * FROM posts WHERE id = ?"; 

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ error: 'Error getting connection from pool' });
      return;
    }

    connection.query(query, [postId], (queryErr, result) => {
      connection.release();
      if (queryErr) {
        console.error('Error fetching post:', queryErr);
        res.status(500).json({ error: 'Error fetching post' });
      } else {
        res.send(result);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




