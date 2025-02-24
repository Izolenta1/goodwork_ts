import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { getResponseByID } from "@controllers/responses_controllers";
import { getVacancyResponses } from "@controllers/responses_controllers";
import { addResponse } from "@controllers/responses_controllers";

// Миддлваеры
import { authenticate_session, checkRole } from "@utils/middlewares";

const router = Router()

router.get("/api/response", authenticate_session, (req: Request, res: Response) => {
    getResponseByID(req, res)
})

router.get("/api/vacancy/response", authenticate_session, checkRole("employer"), (req: Request, res: Response) => {
    getVacancyResponses(req, res)
})

router.post("/api/response", authenticate_session, checkRole("employee"), (req: Request, res: Response) => {
    addResponse(req, res)
})

export default router