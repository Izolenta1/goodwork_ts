import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { getVacancyById } from "@controllers/vacancy_controllers";

const router = Router()

router.get("/api/vacancy/getVacancyById", (req: Request, res: Response) => {
    getVacancyById(req, res)
})

export default router