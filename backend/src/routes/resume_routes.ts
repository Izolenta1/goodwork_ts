import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { getUserResume } from "@controllers/resume_controllers";
import { saveUserResume } from "@controllers/resume_controllers";

// Миддлваеры
import { authenticate_session, checkRole } from "@utils/middlewares";

const router = Router()

router.get("/api/resume", authenticate_session, checkRole("employee"), (req: Request, res: Response) => {
    getUserResume(req, res)
})

router.post("/api/resume", authenticate_session, checkRole("employee"), (req: Request, res: Response) => {
    saveUserResume(req, res)
})

export default router