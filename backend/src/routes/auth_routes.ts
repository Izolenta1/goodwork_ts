import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { login } from "@controllers/auth_controllers";
import { register } from "@controllers/auth_controllers";
import { verifyRegister } from "@controllers/auth_controllers";
import { verifySession } from "@controllers/auth_controllers";
import { createRecovery } from "@controllers/auth_controllers";
import { verifyRecovery } from "@controllers/auth_controllers";
import { changePassword } from "@controllers/auth_controllers";
import { logout } from "@controllers/auth_controllers";

// Миддлваеры
import { authenticate_session } from "@utils/middlewares";

const router = Router()

router.post("/auth/login", (req: Request, res: Response) => {
    login(req, res)
})

router.post("/auth/register", (req: Request, res: Response) => {
    register(req, res)
})

router.post("/auth/register/verify", (req: Request, res: Response) => {
    verifyRegister(req, res)
})

router.post("/auth/verifySession", authenticate_session, (req: Request, res: Response) => {
    verifySession(req, res)
})

router.post("/auth/recovery/create", (req: Request, res: Response) => {
    createRecovery(req, res)
})

router.post("/auth/recovery/verify", (req: Request, res: Response) => {
    verifyRecovery(req, res)
})

router.post("/auth/recovery/changePassword", (req: Request, res: Response) => {
    changePassword(req, res)
})

router.post("/auth/logout", authenticate_session, (req: Request, res: Response) => {
    logout(req, res)
})

export default router