import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

// Контроллеры
import { getFavouriteByID } from "@controllers/favourites_controllers";
import { getUserFavourites } from "@controllers/favourites_controllers";
import { addFavourite } from "@controllers/favourites_controllers";

// Миддлваеры
import { authenticate_session, checkRole } from "@utils/middlewares";

const router = Router()

router.get("/api/favourite", authenticate_session, (req: Request, res: Response) => {
    getFavouriteByID(req, res)
})

router.get("/api/vacancy/favourite", authenticate_session, checkRole("employee"), (req: Request, res: Response) => {
    getUserFavourites(req, res)
})

router.post("/api/favourite", authenticate_session, checkRole("employee"), (req: Request, res: Response) => {
    addFavourite(req, res)
})

export default router