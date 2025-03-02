import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Request, Response } from "express-serve-static-core";
import cryptoRandomString from 'crypto-random-string';

import { dataBaseCheckExisting } from "@controllers/general_controller";
import pool from "@controllers/database_controller";
import transporter from "@configs/mail_transporter";

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

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT t1.*, t2.* 
                                                            FROM users t1
                                                            RIGHT JOIN verify t2
                                                            ON t1.user_id = t2.user_id
                                                            WHERE t1.username = ${pool.escape(req.body.username)}`);
        const verify_check = rows
        if (verify_check.length != 0) {
            return res.status(200).json({status: 409, payload: "Почта пользователя не подтверждена"})
        }
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
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

    let checkEmailRes: RowDataPacket | undefined
    await dataBaseCheckExisting("users", "email", req.body.email).then(function(result) {
        checkEmailRes = result
    })
    if (checkEmailRes != undefined) {
        return res.status(200).json({status: 409, payload: "Данная почта уже существует"})
    }

    if (regCheckUsername(req.body.username) != "") {
        return res.status(200).json({status: 409, payload: regCheckUsername(req.body.username)})
    }
    if (regCheckEmail(req.body.email) != "") {
        return res.status(200).json({status: 409, payload: regCheckEmail(req.body.email)})
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
            const [inserted] = await pool.execute<ResultSetHeader>(`INSERT INTO users (username, email, password, role) VALUES (${pool.escape(req.body.username)}, ${pool.escape(req.body.email)}, ${pool.escape(hashedpass)}, ${pool.escape(req.body.role)});`);
            insertID = inserted.insertId;
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(200).json({status: 500, payload: "Ошибка сервера"})
        }

        const verify_string: string = cryptoRandomString(128)

        try {
            await pool.execute(`INSERT INTO verify (data, is_verified, user_id) VALUES (${pool.escape(verify_string)}, false, ${pool.escape(insertID)});`);
        } catch (error) {
            console.log("Database query error:", error);
            return res.status(200).json({status: 500, payload: "Ошибка сервера"})
        }

        // Отправка письма с ссылкой для подтверждения аккаунта
        transporter.sendMail(getVerifyLetter(req.body.email, req.body.username, verify_string), (err, info) => {
            if (err) return console.log(err)
        })

        return res.status(200).json({status: 200, payload: "Аккаунт успешно создан"})
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }
}

// Функция верификации регистрации
export async function verifyRegister(req: Request, res: Response) {

    // Проверка на длину строки
    if (req.body.verify_id.length != 128) {
        return res.status(200).json({status: 404, payload: "Что-то пошло не так. Возможно истек срок работы ссылки."})
    }

    // Верификация
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM verify WHERE data = ${pool.escape(req.body.verify_id)}`);
        const verify_data = rows;

        if (verify_data.length > 0) {
            await pool.execute(`DELETE FROM verify WHERE data = ${pool.escape(req.body.verify_id)}`);
            return res.status(200).json({status: 200, payload: "Аккаунт успешно активирован. Теперь вы можете войти в аккаунт."})
        }
        else {
            return res.status(200).json({status: 404, payload: "Что-то пошло не так. Возможно истек срок работы ссылки."})
        }
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }
}

// Функция начала восстановления пароля (отправка письма)
export async function createRecovery(req: Request, res: Response) {
    // Проверка полей
    if (regCheckEmail(req.body.email) != "") {
        return res.status(200).json({status: 409, payload: regCheckEmail(req.body.email)})
    }

    let checkEmailRes: RowDataPacket | undefined
    await dataBaseCheckExisting("users", "email", req.body.email).then(function(result) {
        checkEmailRes = result
    })
    if (checkEmailRes == undefined) {
        return res.status(200).json({status: 409, payload: "Указанной почты не существует"})
    }

    // Взятие информации о пользователе
    let user_data: RowDataPacket | undefined
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM users WHERE email = ${pool.escape(req.body.email)}`);
        user_data = rows[0];
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }

    // Генерация строки для восстановления пароля
    const recovery_string: string = cryptoRandomString(128)

    // Создание записи в БД о восстановлении пароля
    try {
        await pool.execute(`INSERT INTO recovery (data, user_id) VALUES (${pool.escape(recovery_string)}, ${pool.escape(user_data.user_id)});`);
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }

    // Отправка письма
    transporter.sendMail(getCreateRecoveryLetter(req.body.email, user_data.username, recovery_string), (err, info) => {
        if (err) return console.log(err)
    })

    return res.status(200).json({status: 200, payload: "Письмо для восстановления отправлено на почту."})
}

// Функция для верификации строки верификации
export async function verifyRecovery(req: Request, res: Response) {
    // Проверка на длину строки
    if (req.body.recovery_id.length != 128) {
        return res.status(200).json({status: 404, payload: "Not verified"})
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM recovery WHERE data = ${pool.escape(req.body.recovery_id)}`);
        const recovery_data = rows;

        if (recovery_data.length > 0) {
            return res.status(200).json({status: 200, payload: "Verified", recovery_id: req.body.recovery_id})
        }
        else {
            return res.status(200).json({status: 404, payload: "Not verified"})
        }
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }
}

// Функция изменения пароля при восстановлении
export async function changePassword(req: Request, res: Response) {
    // Проверка строки восстановления
    // Проверка на длину строки
    if (req.body.recovery_id.length != 128) {
        return res.status(200).json({status: 403, payload: "Пароль не может быть изменен"})
    }

    // Проверка на наличии в БД
    let recovery_data: RowDataPacket[] | undefined
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT t1.*, t2.* 
                                                            FROM users t1
                                                            RIGHT JOIN recovery t2
                                                            ON t1.user_id = t2.user_id
                                                            WHERE t2.data = ${pool.escape(req.body.recovery_id)}`);
        recovery_data = rows
        if (recovery_data.length == 0) {
            return res.status(200).json({status: 403, payload: "Пароль не может быть изменен"})
        }
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }

    const recovery_user: RowDataPacket = recovery_data[0]

    // Проверка пароля
    if (req.body.password != req.body.repeated) {
        return res.status(200).json({status: 409, payload: "Пароли не совпадают"})
    }
    if (regCheckPassword(req.body.password) != "") {
        return res.status(200).json({status: 409, payload: regCheckPassword(req.body.password)})
    }
    if (regCheckPassword(req.body.repeated) != "") {
        return res.status(200).json({status: 409, payload: regCheckPassword(req.body.repeated)})
    }

    // Создание хеша пароля
    const hashed_password = await bcrypt.hash(req.body.password, 10)

    // Сохранение пароля в БД
    try {
        await pool.execute(`UPDATE users SET password = ${pool.escape(hashed_password)} WHERE user_id = ${recovery_user.user_id};`);
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }

    // Отправка письма об изменении пароля
    transporter.sendMail(getChangePasswordLetter(recovery_user.email, recovery_user.username), (err, info) => {
        if (err) return console.log(err)
    })

    // Удаление информации об восстановлении
    try {
        await pool.execute(`DELETE FROM recovery WHERE data = ${pool.escape(req.body.recovery_id)}`);
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }

    return res.status(200).send({status: 200, payload: "Password was changed"})
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

// Проверка почты
function regCheckEmail(email: string): string {
    let emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (!emailRegex.test(email)) {
        return "Некорректная почта"
    }
    if (!(email.length > 0)) {
        return "Почта должна быть не короче 4 символов"
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



interface Letter {
    to: string,
    subject: string,
    text: string
}

function getVerifyLetter(to: string, username: string, verify_string: string): Letter {
    let message = {
        to: to,
        subject: 'Подтверждение почты на сайте GoodWork',
        text: `
        Здравствуйте, ${username}!
            
        Вы получили это письмо, так как ваш email адрес был использован при регистрации на сайте GoodWork. Если не вы регистрировались на сайте, убедительная просьба проигнорировать данное письмо.
                
        -----------------------------
                
        Для активации аккаунта перейдите по следующей ссылке:
        ${`${process.env.MAIL_URL}/verify/${verify_string}`}

        Если не активировать аккаунт, он будет удален в течение некоторого времени.
                
        -----------------------------
                
        С уважением,
        администрация сайта GoodWork`
    }

    return message
}



function getCreateRecoveryLetter(to: string, username: string, recovery_string: string): Letter {
    let message = {
        to: to,
        subject: 'Восстановление пароля на сайте GoodWork',
        text: `
        Здравствуйте, ${username}!
        
        Вы получили это письмо, так как на ваш email был использован для восстановления пароля. Если вы не пытались восстановить пароль, можете проигнорировать данное письмо.
                
        -----------------------------
                
        Для восстановления пароля перейдите по следующей ссылке:
        ${`${process.env.MAIL_URL}/recovery/${recovery_string}`}

        Через некоторое время ссылка станет неактивна.
                
        -----------------------------
                
        С уважением,
        администрация сайта GoodWork`
    }

    return message
}



function getChangePasswordLetter(to: string, username: string): Letter {
    let message = {
        to: to,
        subject: 'Изменение пароля на сайте GoodWork',
        text: `
        Здравствуйте, ${username}!
        
        Вы получили это письмо, так как ваш пароль на сайте GoodWork был изменён. Если это делали не вы, рекомендуем обратиться в поддержку: odnorazovaya33@yandex.ru.
                
        С уважением,
        администрация сайта GoodWork`
    }

    return message
}