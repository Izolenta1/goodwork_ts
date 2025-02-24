import { Request, Response } from "express-serve-static-core";
import { RowDataPacket } from "mysql2";

import pool from "@controllers/database_controller";

// Функция для получения резюме пользователя
export async function getUserResume(req: Request, res: Response) {
    let user_resume: RowDataPacket | undefined = undefined
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * from resumes WHERE user_id = ${pool.escape(req.session_data?.user_id)}`);
        user_resume = rows[0];
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }

    if (user_resume != undefined) {
        return res.status(200).json({status: 200, payload: user_resume})
    }
    else {
        return res.status(200).json({status: 200, payload: {resume_id: "", email: "", description: "", user_id: ""}})
    }
}

export async function saveUserResume(req: Request, res: Response) {
    if (req.body.email.length == 0) {
        return res.status(200).json({status: 411, payload: "Длина почты должна быть больше 0"})
    }

    if (req.body.description.length == 0) {
        return res.status(200).json({status: 411, payload: "Длина резюме должна быть больше 0"})
    }

    if (req.body.email.length > 255) {
        return res.status(200).json({status: 409, payload: "Длина email не должна быть больше 255 символов"})
    }

    if (req.body.description.length > 50000) {
        return res.status(200).json({status: 409, payload: "Длина резюме не должна быть больше 50000 символов"})
    }

    if (regCheckEmail(req.body.email) != "") {
        return res.status(200).json({status: 409, payload: regCheckEmail(req.body.email)})
    }

    try {
        await pool.execute(`INSERT INTO resumes SET email = ${pool.escape(req.body.email)}, description = ${pool.escape(req.body.description)}, user_id = ${pool.escape(req.session_data?.user_id)}
                            ON DUPLICATE KEY UPDATE email = ${pool.escape(req.body.email)}, description = ${pool.escape(req.body.description)}, user_id = ${pool.escape(req.session_data?.user_id)}`)
        return res.status(200).json({status: 200, payload: "Резюме успешно сохранено"})
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}





// Функция для проверки почты
function regCheckEmail(email: string): string {
    let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (!emailRegex.test(email)) {
        return "Введите корректную почту"
    }
    return ""
}