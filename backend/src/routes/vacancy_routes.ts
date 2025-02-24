import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { getVacancyById } from "@controllers/vacancy_controllers";
import { getAllVacancies } from "@controllers/vacancy_controllers";
import { getUserVacancies } from "@controllers/vacancy_controllers";
import { addVacancy } from "@controllers/vacancy_controllers";
import { updateVacancy } from "@controllers/vacancy_controllers";
import { deleteVacancy } from "@controllers/vacancy_controllers";

// Мидлваеры
import { authenticate_session } from "@utils/middlewares";
import { checkRole } from "@utils/middlewares";

const router = Router()

router.get("/api/vacancy/getVacancyById", (req: Request, res: Response) => {
    getVacancyById(req, res)
})

router.get("/api/vacancy/getAllCavancies", (req: Request, res: Response) => {
    getAllVacancies(req, res)
})

router.get("/api/vacancy/getUserVacancies", authenticate_session, checkRole("employer"), (req: Request, res: Response) => {
    getUserVacancies(req, res)
})

router.post("/api/vacancy/addVacancy", authenticate_session, checkRole("employer"), (req: Request, res: Response) => {
    addVacancy(req, res)
})

router.post("/api/vacancy/updateVacancy", authenticate_session, checkRole("employer"), (req: Request, res: Response) => {
    updateVacancy(req, res)
})

router.post("/api/vacancy/deleteVacancy", authenticate_session, checkRole("employer"), (req, res) => {
    deleteVacancy(req, res)
})

export default router