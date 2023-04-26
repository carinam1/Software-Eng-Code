const mysql = require('mysql');

const pool = mysql.createPool({
  // Replace the placeholders with your Google Cloud SQL connection information
  connectionLimit: 1,
  user: 'root',
  password: "dTO<A8Z'J1,[iG)v",
  database: 'APIsDatabase',
  socketPath: '/cloudsql/nuyu-381420:us-east4:nuyu'
});

exports.addFood = (req, res) => {
  const { foodName, calories, protein, fat, carbs } = req.body;
  const query = 'INSERT INTO foods (food_name, calories, protein, fat, carbs) VALUES (?, ?, ?, ?, ?)';
  
  pool.query(query, [foodName, calories, protein, fat, carbs], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding food to the database.');
    } else {
      res.status(200).send('Food added successfully.');
    }
  });
};
