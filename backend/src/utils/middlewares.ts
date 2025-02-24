import { Request, Response, NextFunction } from "express-serve-static-core"

import { getSessionInfo } from "@controllers/auth_controllers"

// Функция аутентификации сессии пользователя
export async function authenticate_session(req: Request, res: Response, next: NextFunction)  {
    if (!req.cookies.goodwork_session) {
        res.status(200).json({status: 401, payload: "Unauthorized"})
    }

    const user_data = await getSessionInfo(req.cookies.goodwork_session)
    if (!user_data) {
        res.status(200).json({status: 401, payload: "Unauthorized"})
    }

    req.session_data = {
        user_id: user_data?.user_id,
        username: user_data?.username,
        role: user_data?.role
    }
    req.session_id = req.cookies.goodwork_session

    return next()
}

// Функция проверки роли после аутентификации
export function checkRole(role: string) {
    return function(req: Request, res: Response, next: NextFunction) {
        if (req.session_data?.role != role) {
            res.status(200).send({status: 403, payload: "Forbidden"})
        }
        else {
            return next()
        }
    }
}