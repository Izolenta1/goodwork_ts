import { Request, Response } from "express-serve-static-core";
import { RowDataPacket } from "mysql2";

import pool from "@controllers/database_controller";

// Функция получения отклика по ID
export async function getResponseByID(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM responses WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.query.vacancy_id)}`);
        const response = rows[0];
        return res.status(200).json({ status: 200, payload: response })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Получение всех откликов определенной вакансии
export async function getVacancyResponses(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT t1.*, t2.*, t3.username
                                                            FROM responses t1
                                                            LEFT JOIN resumes t2
                                                            ON t1.user_id = t2.user_id
                                                            LEFT JOIN users t3
                                                            ON t1.user_id = t3.user_id
                                                            WHERE t1.vacancy_id = ${req.query.vacancy_id}`);
        const responses = rows;
        return res.status(200).json({ status: 200, payload: responses })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция отклика на вакансию
export async function addResponse(req: Request, res: Response) {

    // Проверка существования резюме
    let check_resume_res: RowDataPacket[] | undefined = undefined
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM resumes WHERE user_id = ${pool.escape(req.session_data?.user_id)}`);
        check_resume_res = rows;
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }

    if (check_resume_res?.length == 0) {
        return res.status(200).json({ status: 200, payload: "Нет резюме" })
    }



    // Добавление или удаление отклика
    let check_response_res: RowDataPacket[] | undefined = undefined
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM responses WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.body.vacancy_id)}`);
        check_response_res = rows;
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }

    if (check_response_res?.length != 0) {
        try {
            await pool.execute(`DELETE FROM responses WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.body.vacancy_id)}`)
            return res.status(200).json({ status: 200, payload: "Отклик удален" })
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(500).json({ status: 500, message: "Internal Server Error"});
        }
    }
    else {
        try {
            await pool.execute(`INSERT INTO responses SET user_id = ${pool.escape(req.session_data?.user_id)}, vacancy_id = ${pool.escape(req.body.vacancy_id)}`)
            return res.status(200).json({ status: 200, payload: "Отклик добавлен" })
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(500).json({ status: 500, message: "Internal Server Error"});
        }
    }
}