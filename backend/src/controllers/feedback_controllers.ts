import { Request, Response } from "express-serve-static-core";
import { RowDataPacket, ResultSetHeader } from "mysql2";

import pool from "@controllers/database_controller";

// Функция получения всех комментариев вакансии
export async function getAllComments(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT t1.*, t2.username
                                                            FROM feedbacks t1
                                                            LEFT JOIN users t2
                                                            ON t1.user_id = t2.user_id
                                                            WHERE t1.vacancy_id = ${req.query.vacancy_id}`);
        const comments = rows
        return res.status(200).json({ status: 200, payload: comments })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция добавления комментария к вакансии
export async function addComment(req: Request, res: Response) {
    if (checkValueMinMax(req.body.comment, "отзыва", 50, 1000) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.comment, "отзыва", 50, 1000) })
    }

    let insertID: number | undefined = undefined
    try {
        const [inserted] = await pool.execute<ResultSetHeader>(`INSERT INTO feedbacks SET comment = ${pool.escape(req.body.comment)}, user_id = ${pool.escape(req.session_data?.user_id)}, vacancy_id = ${pool.escape(req.body.vacancy_id)}`);
        insertID = inserted.insertId;
        return res.status(200).json({ status: 200, payload: {feedback_id: insertID, comment: req.body.comment, username: req.session_data?.username} })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }
}





// Вспомогательные функции
function checkValueMinMax(value: string, name: string, min: number, max: number): string {
    if (value.length < min) {
        return `Длина поля ${name} не должна быть меньше ${min}`
    }
    if (value.length > max) {
        return `Длина поля ${name} не должна быть больше ${max}`
    }

    return ""
}