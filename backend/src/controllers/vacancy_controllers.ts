import { Request, Response } from "express-serve-static-core";
import { RowDataPacket } from "mysql2";

import { GetAllVacanciesQueryParams } from "@pr_types/vacancy_types";
import { dataBaseCheckExisting } from "@controllers/general_controller";

import pool from "@controllers/database_controller";

// Функция получения информации о конкретной вакансии
export async function getVacancyById(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM vacancy WHERE vacancy_id = ${pool.escape(req.query.vacancy_id)}`);
        const vacancy = rows[0];
        return res.status(200).json({ status: 200, payload: vacancy });
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция поиска вакансий
export async function getAllVacancies(req: Request<unknown, unknown, unknown, GetAllVacanciesQueryParams>, res: Response) {
    // Проверка на наличие пагинации
    if (!req.query.page) {
        req.query.page = 1
        if (req.originalUrl.endsWith("/getAllCavancies")) {
            req.originalUrl = req.originalUrl + "?page=1"
        }
        else {
            req.originalUrl = req.originalUrl + "&page=1"
        }
    }

    let currentPage: number = Number(req.query.page)

    // Проверка на корректные поисковые запросы
    const ALLOWED_PARAMS: string[] = ["page", "min_salary", "max_salary", "min_exp", "max_exp", "search"]
    for (let key in req.query) {
        if (!ALLOWED_PARAMS.includes(key)) {
            return res.status(200).json({ status: 404, payload: "Не найдено" });
        }
    }

    // Константа вакансий на каждой странице
    const VACANCIES_PER_PAGE: number = 10

    // Определение количества страниц по данному запросу
    let vacancies_count: number
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) as count FROM vacancy ${queryToSQL({...req.query})}`);
        vacancies_count = rows[0].count;
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
    let page_count: number = Math.ceil(vacancies_count / VACANCIES_PER_PAGE)

    // Проверка на корректность номера введеной страницы
    if (currentPage > page_count) {
        return res.status(200).json({ status: 200, payload: { next: null, result: [] } })
    }

    // Формирование следующей ссылки
    let next_link: string | null
    if (currentPage + 1 <= page_count) {
        next_link = req.originalUrl.replace(/page=\d+/g, `page=${currentPage + 1}`)
    }
    else {
        next_link = null
    }

    // Получение вакансий конкретной страницы
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM vacancy ${queryToSQL({...req.query})} LIMIT ${(currentPage - 1) * VACANCIES_PER_PAGE}, ${VACANCIES_PER_PAGE}`);
        const found_vacancies = rows;
        return res.status(200).json({ status: 200, payload: {next : next_link, result: found_vacancies} })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
}

// Функция получения вакансий юзера
export async function getUserVacancies(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM vacancy WHERE user_id = ${pool.escape(req.session_data?.user_id)}`);
        const user_vacancies = rows;
        return res.status(200).json({ status: 200, payload: user_vacancies })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция добавлении вакансии
export async function addVacancy(req: Request, res: Response) {
    let checkDescriptionRes: RowDataPacket | undefined
    await dataBaseCheckExisting("vacancy", "description", req.body.description).then(function (result) {
        checkDescriptionRes = result
    })

    if (checkDescriptionRes != undefined) {
        return res.status(200).json({ status: 409, payload: "Вакансия с таким описанием уже существует" })
    }

    if (checkValueMinMax(req.body.title, "заголовка", 10, 254) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.title, "заголовка", 10, 254) })
    }
    if (checkValueMinMax(req.body.salary, "зарплаты", 1, 15) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.salary, "зарплаты", 1, 15) })
    }
    if (checkValueMinMax(req.body.exp, "опыта работы", 1, 5) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.exp, "опыта работы", 1, 5) })
    }
    if (checkValueMinMax(req.body.description, "описания", 1000, 50000) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.description, "описания", 1000, 50000) })
    }
    if (checkSalary(req.body.salary) != "") {
        return res.status(200).json({ status: 409, payload: checkSalary(req.body.salary) })
    }
    if (checkExp(req.body.exp) != "") {
        return res.status(200).json({ status: 409, payload: checkExp(req.body.exp) })
    }

    try {
        await pool.execute(`INSERT INTO vacancy SET title = ${pool.escape(req.body.title)}, salary = ${pool.escape(req.body.salary)}, experience = ${pool.escape(req.body.exp)}, description = ${pool.escape(req.body.description)}, user_id = ${pool.escape(req.session_data?.user_id)}`);
        return res.status(200).json({ status: 200, payload: "Вакансия успешно добавлена" })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }



    // Гипотетическая новая версия от гптшки
    // if (checkDescriptionRes != null) {
    //     return res.status(200).json({ status: 409, payload: "Вакансия с таким описанием уже существует" });
    // }
    
    // // Массив проверок
    // const validations: { check: () => string, field: string }[] = [
    //     { check: () => checkValueMinMax(req.body.title, "заголовка", 10, 254), field: "title" },
    //     { check: () => checkValueMinMax(req.body.salary, "зарплаты", 1, 15), field: "salary" },
    //     { check: () => checkValueMinMax(req.body.exp, "опыта работы", 1, 5), field: "exp" },
    //     { check: () => checkValueMinMax(req.body.description, "описания", 1000, 50000), field: "description" },
    //     { check: () => checkSalary(req.body.salary), field: "salary" },
    //     { check: () => checkExp(req.body.exp), field: "exp" }
    // ];
    
    // // Проверяем каждую валидацию и сразу возвращаем ошибку, если есть
    // for (const validation of validations) {
    //     const error = validation.check();
    //     if (error !== "") {
    //         return res.status(200).json({ status: 409, payload: error });
    //     }
    // }
}

// Функция обновления вакансии
export async function updateVacancy(req: Request, res: Response) {
    let check_description_res: RowDataPacket[] = []
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM vacancy WHERE description = ${pool.escape(req.body.description)}`);
        check_description_res = rows;
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(200).json({status: 500, payload: "Ошибка сервера"})
    }

    if (check_description_res.length != 0) {
        if (check_description_res.length > 1 || check_description_res[0].vacancy_id != req.body.vacancy_id) {
            return res.status(200).json({ status: 409, payload: "Вакансия с таким описанием уже существует" })
        }
    }

    if (checkValueMinMax(req.body.title, "заголовка", 10, 254) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.title, "заголовка", 10, 254) })
    }
    if (checkValueMinMax(req.body.salary, "зарплаты", 1, 15) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.salary, "зарплаты", 1, 15) })
    }
    if (checkValueMinMax(req.body.exp, "опыта работы", 1, 5) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.exp, "опыта работы", 1, 5) })
    }
    if (checkValueMinMax(req.body.description, "описания", 1000, 50000) != "") {
        return res.status(200).json({ status: 409, payload: checkValueMinMax(req.body.description, "описания", 1000, 50000) })
    }
    if (checkSalary(req.body.salary) != "") {
        return res.status(200).json({ status: 409, payload: checkSalary(req.body.salary) })
    }
    if (checkExp(req.body.exp) != "") {
        return res.status(200).json({ status: 409, payload: checkExp(req.body.exp) })
    }

    try {
        await pool.execute(`UPDATE vacancy SET title = ${pool.escape(req.body.title)}, salary = ${pool.escape(req.body.salary)}, experience = ${pool.escape(req.body.exp)}, description = ${pool.escape(req.body.description)} WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.body.vacancy_id)}`)
        return res.status(200).json({ status: 200, payload: "Вакансия успешно обновлена" })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}

// Функция удаления вакансии
export async function deleteVacancy(req: Request, res: Response) {
    try {
        await pool.execute(`DELETE FROM vacancy WHERE user_id = ${pool.escape(req.session_data?.user_id)} AND vacancy_id = ${pool.escape(req.body.vacancy_id)}`)
        return res.status(200).json({ status: 200, payload: "Вакансия успешно удалена" })
    } catch (error) {
        console.log("Database query error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error"});
    }
}





// Вспомогательные функции
function checkValueMinMax(value: string, name: string, min: number, max: number): string {
    if (value.length < min) {
        return `Длина поля ${name} не должна быть меньше ${min}`
    }
    if (value.length > max) {
        return `Длина поля ${name} не должна быть больше ${max}`
    }

    return ""
}

function checkSalary(value: string): string {
    let num_reg = /^\d+$/
    if (!num_reg.test(value)) {
        return `Зарплата должна содержать только цифры`
    }

    let number = parseInt(value)
    if (number < 0) {
        return `Зарплата не должна быть меньше ${0}`
    }
    if (number > 100000000) {
        return `Зарплата не должна быть больше ${100000000}`
    }

    return ""
}

function checkExp(value: string): string {
    let num_reg = /^\d+$/
    if (!num_reg.test(value)) {
        return `Опыт должен содержать только цифры`
    }

    let number = parseInt(value)
    if (number < 0) {
        return `Опыт не должен быть меньше ${0}`
    }
    if (number > 50) {
        return `Опыт не должен быть больше ${50}`
    }

    return ""
}

function queryToSQL(query: GetAllVacanciesQueryParams): string {
    delete query.page

    let params_array: string[] = []
    for (let key in query) {
        params_array.push(paramToSQL(key, (query as Record<string, any>)[key]))
    }

    if (params_array.length > 0) {
        return `WHERE ${params_array.join(" AND ")}`
    }

    return ``
}

function paramToSQL(param: string, value: string): string {
    switch (param) {
        case "min_salary":
            return `salary >= ${pool.escape(value)}`
            break;
        case "max_salary":
            return `salary <= ${pool.escape(value)}`
            break;
        case "min_exp":
            return `experience >= ${pool.escape(value)}`
            break;
        case "max_exp":
            return `experience <= ${pool.escape(value)}`
            break;
        case "search":
            return `title LIKE ${pool.escape(`%${value}%`)}`
            break
    }

    return ""
}