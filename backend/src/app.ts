import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { CronJob } from "cron";

import { Express } from "express-serve-static-core";

import auth_routes from "@routes/auth_routes";
import resume_routes from "@routes/resume_routes";
import vacancy_router from "@routes/vacancy_routes";
import responses_router from "@routes/responses_routes";
import favourites_routes from "@routes/favourites_routes";
import feedback_routes from "@routes/feedback_routes";

import { clearTemporaryValues } from "@utils/cron";

const app: Express = express();

app.use(express.json());
app.use(cookieParser())

const cors_options = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200,
    methods: "GET, POST"
}
app.use(cors(cors_options))

// Подключение маршрутов
app.use(auth_routes)
app.use(resume_routes)
app.use(vacancy_router)
app.use(responses_router)
app.use(favourites_routes)
app.use(feedback_routes)

const PORT = 3001;

let job = new CronJob(
    '0 */30 * * * *',
    async function() {
        clearTemporaryValues()
    }
);

app.listen(PORT, () => {
    job.start()
    console.log("Server is Successfully Running, and App is listening on port: " + PORT)
});