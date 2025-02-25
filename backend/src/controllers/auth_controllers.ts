import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express-serve-static-core";

import { dataBaseCheckExisting } from "@controllers/general_controller";
import pool from "@controllers/database_controller";

// Функция логина пользователя
export async function login(req: Request, res: Response) {
    if (req.body.username.length == 0) {
        return res.status(200).json({status: 411, payload: "Длина логина должна быть больше 0"})
    }

    if (req.body.password.length == 0) {
        return res.status(200).json({status: 411, payload: "Длина пароля должна быть больше 0"})
    }

    let checkUsernameRes: RowDataPacket | undefined
    await dataBaseCheckExisting("users", "username", req.body.username).then(function(result) {
        checkUsernameRes = result
    })
    if (checkUsernameRes == undefined) {
        return res.status(200).json({status: 409, payload: "Неправильный логин или пароль"})
    }

    let hashedpassDB: string = ""
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT password FROM users WHERE username = ${pool.escape(req.body.username)}`);
        hashedpassDB = rows[0].password;
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }

    try {
        if (await bcrypt.compare(req.body.password, hashedpassDB)) {
            let user_data: RowDataPacket | undefined = undefined
            try {
                const [rows] = await pool.execute<RowDataPacket[]>(`SELECT user_id, username, role from users WHERE username = ${pool.escape(req.body.username)}`);
                user_data = rows[0];
            } catch (error) {
                console.log("Database query error:", error);
                return res.status(200).json({status: 500, payload: "Ошибка сервера"})
            }

            let user_id: number = user_data?.user_id
            let session_id: string = uuidv4()
            pool.execute(`INSERT INTO sessions SET uuid = ${pool.escape(session_id)}, user_id = ${pool.escape(user_id)}`)
            
            res.cookie("goodwork_session", session_id, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 1000 * 60 * 259200
            })
            return res.status(200).json({status: 200, payload: {user_id: user_id, username: user_data?.username, role: user_data?.role}})
        }
        else {
            return res.status(200).json({status: 401, payload: "Неправильный логин или пароль"})
        }
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }
}

// Функция регистрации аккаунта
export async function register(req: Request, res: Response) {
    let checkUsernameRes: RowDataPacket | undefined
    await dataBaseCheckExisting("users", "username", req.body.username).then(function(result) {
        checkUsernameRes = result
    })
    if (checkUsernameRes != undefined) {
        return res.status(200).json({status: 409, payload: "Данный логин уже существует"})
    }

    if (regCheckUsername(req.body.username) != "") {
        return res.status(200).json({status: 409, payload: regCheckUsername(req.body.username)})
    }
    if (req.body.password != req.body.repeated) {
        return res.status(200).json({status: 409, payload: "Пароли не совпадают"})
    }
    if (regCheckPassword(req.body.password) != "") {
        return res.status(200).json({status: 409, payload: regCheckPassword(req.body.password)})
    }
    if (regCheckPassword(req.body.repeated) != "") {
        return res.status(200).json({status: 409, payload: regCheckPassword(req.body.repeated)})
    }
    if (req.body.role != "employee" && req.body.role != "employer") {
        return res.status(200).json({status: 409, payload: "Не выбрана роль"})
    }

    try {
        const hashedpass = await bcrypt.hash(req.body.password, 10)
        let insertID: number | undefined = undefined
        try {
            const [inserted] = await pool.execute<ResultSetHeader>(`INSERT INTO users (username, password, role) VALUES (${pool.escape(req.body.username)}, ${pool.escape(hashedpass)}, ${pool.escape(req.body.role)});`);
            insertID = inserted.insertId;
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(200).json({status: 500, payload: "Ошибка сервера"})
        }

        let session_id: string = uuidv4()
        pool.execute(`INSERT INTO sessions SET uuid = ${pool.escape(session_id)}, user_id = ${pool.escape(insertID)}`)

        res.cookie("goodwork_session", session_id, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 259200
        })
        return res.status(200).json({status: 200, payload: "Аккаунт успешно создан"})
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }
}

// Функция для верификации сессии
export async function verifySession(req: Request, res: Response) {
    let payload = {
        user_id: req.session_data?.user_id,
        username: req.session_data?.username,
        role: req.session_data?.role
    }

    return res.status(200).json({status: 200, payload: payload})
}

// Функция для выхода из аккаунт (удаление сессии из куки)
export async function logout(req: Request, res: Response) {
    try {
        await pool.execute(`DELETE FROM sessions WHERE uuid = ${pool.escape(req.session_id)}`)
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }

    res.clearCookie("goodwork_session")
    return res.status(200).json({status: 200, payload: "Session deleted"})
}

// Функция получения информации о пользователе с помощью id сессии
export async function getSessionInfo(session_id: string) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT sessions.*, users.username, users.role FROM sessions JOIN users ON sessions.user_id = users.user_id WHERE sessions.uuid = ${pool.escape(session_id)}`);
        const user_data = rows[0];
        return user_data
    } catch (error) {
        console.log("Database query error:", error);
    }
}





// Дополнительные функции
function regCheckUsername(username: string): string {
    let usernameRegex = /^[a-zA-Z][a-zA-Z0-9-_]+$/;
    if (!usernameRegex.test(username)) {
        return "Логин должен содержать только латинские буквы"
    }
    if (!(username.length <= 20)) {
        return "Логин должен быть не длинее 20 символов"
    }
    if (!(username.length > 3)) {
        return "Логин должен быть не короче 3 символов"
    }
    return ""
}

function regCheckPassword(password: string): string {
    if (!(password.length > 6)) {
        return "Длина пароля должна быть не менее 7 символов"
    }
    if (password.length > 64) {
        return "Длина пароля не должна быть больше 64 символов"
    }
    return ""
}