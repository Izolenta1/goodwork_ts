import mysql from "mysql2";
import dotenv from "dotenv";
import { Pool, PoolOptions } from "mysql2/promise";

dotenv.config();

const CONNECTION_CONFIG: PoolOptions = {
    connectionLimit: 20,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}

const pool: Pool = mysql.createPool(CONNECTION_CONFIG).promise();

export default pool