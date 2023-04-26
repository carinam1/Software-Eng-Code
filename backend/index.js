const mysql = require('mysql');
const functions = require('firebase-functions');

const pool = mysql.createPool({
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

exports.removeFood = functions.https.onRequest(async (request, response) => {
    const foodId = request.body.food_id;

    if (!foodId) {
        response.status(400).send('No food id provided');
        return;
    }

    try {
        await pool.query('DELETE FROM foods WHERE id = ?', [foodId]);
        response.status(200).send({ message: 'Food entry removed successfully' });
    } catch (error) {
        console.error('removeFood', error);
        response.status(500).send('Error removing food entry');
    }
});
