import { Request, Response } from "express-serve-static-core";
import { RowDataPacket } from "mysql2";

import pool from "@controllers/database_controller";

export async function getVacancyById(req: Request, res: Response) {
    // const vacancy = (await pool.execute(`SELECT * FROM vacancy WHERE vacancy_id = ${pool.escape(req.query.vacancy_id)}`))[0][0]
    // return res.status(200).json({ status: 200, payload: vacancy })

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM vacancy WHERE vacancy_id = ${pool.escape(req.query.vacancy_id)}`);
        const vacancy = rows[0];
        return res.status(200).json({ status: 200, payload: vacancy });
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error: " + error });
    }
}