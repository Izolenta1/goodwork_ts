import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

import { Express } from "express-serve-static-core";

import vacancy_router from "@routes/vacancy_routes";

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
app.use(vacancy_router)

const PORT = 3001;

app.listen(PORT, () => {
    console.log("Server is Successfully Running, and App is listening on port: " + PORT)
});