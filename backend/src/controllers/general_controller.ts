import { RowDataPacket } from "mysql2";

import pool from "@controllers/database_controller";

export async function dataBaseCheckExisting(table: string, column: string, value: string | number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT user_id FROM ${table} WHERE ${column} = ${pool.escape(value)}`);
        const info = rows[0];
        return info
    } catch (error) {
        console.log("Database query error:", error);
    }
}