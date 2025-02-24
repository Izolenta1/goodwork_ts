import { Request, Response } from "express-serve-static-core";
import { RowDataPacket } from "mysql2";

import pool from "@controllers/database_controller";

// Функция получения ищбранной вакансии по ID
export async function getFavouriteByID(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM favourites WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.query.vacancy_id)}`);
        const favourite = rows[0];
        return res.status(200).json({ status: 200, payload: favourite })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция получения избранных вакансий пользователя
export async function getUserFavourites(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT t1.*, t2.*
                                                            FROM favourites t1
                                                            LEFT JOIN vacancy t2
                                                            ON t1.vacancy_id = t2.vacancy_id
                                                            WHERE t1.user_id = ${req.session_data?.user_id}`);
        const favourites_list = rows;
        return res.status(200).json({ status: 200, payload: favourites_list })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция удаления и добавления избранной вакансии
export async function addFavourite(req: Request, res: Response) {
    let check_favourite_res: RowDataPacket[] | undefined = undefined
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM favourites WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.body.vacancy_id)}`);
        check_favourite_res = rows;
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }

    if (check_favourite_res?.length != 0) {
        try {
            await pool.execute(`DELETE FROM favourites WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.body.vacancy_id)}`)
            return res.status(200).json({ status: 200, payload: "Избранная вакансия удалена" })
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(500).json({ status: 500, message: "Internal Server Error"});
        }
    }
    else {
        try {
            await pool.execute(`INSERT INTO favourites SET user_id = ${pool.escape(req.session_data?.user_id)}, vacancy_id = ${pool.escape(req.body.vacancy_id)}`)
            return res.status(200).json({ status: 200, payload: "Избранная вакансия добавлена" })
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(500).json({ status: 500, message: "Internal Server Error"});
        }
    }
}