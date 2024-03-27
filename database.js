const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})
.promise();

export async function insertToken(user) {
    await pool.query(
        'INSERT INTO email_token (user_id, token) VALUES (?, ?)',
        [user.user_id, user.token]
    );
}