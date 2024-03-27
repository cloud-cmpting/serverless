const mysql = require('mysql2');
const strftime = require('strftime');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})
.promise();

async function insertToken(user) {
    await pool.query(
      "INSERT INTO email_token (user_id, token, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [
        user.user_id,
        user.token,
        strftime("%Y-%m-%d %H:%M:%S"),
        strftime("%Y-%m-%d %H:%M:%S"),
      ]
    );
}

exports.insertToken = insertToken;