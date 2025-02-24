import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { getAllComments } from "@controllers/feedback_controllers";
import { addComment } from "@controllers/feedback_controllers";

// Миддлваеры
import { authenticate_session, checkRole } from "@utils/middlewares";

const router = Router()

router.get("/api/vacancy/feedback", (req: Request, res: Response) => {
    getAllComments(req, res)
})

router.post("/api/vacancy/feedback", authenticate_session, checkRole("employee"), (req: Request, res: Response) => {
    addComment(req, res)
})

export default router