interface HHRuVacancy {
    vacancy_id: string,
    type: "HHRU"
    title: string,
    salary: string,
    currency: string,
    experience: number,
    description: string,
    url: string
}

export async function getHHRuData(page: number, per_page: number, search: string | undefined, experienceFrom: number, experienceTo: number, salaryFrom: number,) {
    // Сбор параметров
    let queryData: Record<string, string> = {
        page: page.toString(),
        per_page: per_page.toString(),
        search_field: "name",
        only_with_salary: 'true',
        currency: "RUR",
        salary: "1",
        area: "113"
    }

    if (search != undefined) {
        queryData.text = search
    }

    let exp_string = ""
    if (!Number.isNaN(experienceFrom) || !Number.isNaN(experienceTo)) {
        let exp_array: string[] = []

        if (Number.isNaN(experienceFrom)) {
            experienceFrom = 0
        }

        if (Number.isNaN(experienceTo)) {
            experienceTo = 99
        }

        if (experienceFrom > experienceTo) {
            let buf: number = experienceFrom
            experienceFrom = experienceTo
            experienceTo = buf
        }

        if (experienceFrom <= 0 && experienceTo >= 0) {
            exp_array.push("noExperience");
        }
        if (experienceFrom <= 1 && experienceTo >= 1 || experienceFrom <= 3 && experienceTo >= 3) {
            exp_array.push("between1And3");
        }
        if (experienceFrom <= 3 && experienceTo >= 3 || experienceFrom <= 6 && experienceTo >= 6) {
            exp_array.push("between3And6");
        }
        if (experienceFrom >= 6 || experienceTo > 6) {
            exp_array.push("moreThan6");
        }

        if (exp_array.length == 1) {
            exp_string = exp_array[0]
        }
        else {
            exp_string = exp_array.join("&experience=")
        }
    }

    if (!Number.isNaN(salaryFrom)) {
        queryData.salary = salaryFrom.toString()
    }

    let query_string = new URLSearchParams(queryData).toString()
    if (exp_string != "") {
        query_string += `&experience=${exp_string}`
    }

    // Запрос на вакансии
    const hhru_response = await fetch(`https://api.hh.ru/vacancies?${new URLSearchParams(query_string).toString()}`, {
        headers: {
            "User-Agent": "Diplom (novikovga03@gmail.com)"
        }
    })

    const hhru_data = await hhru_response.json()

    // Проверка на успешную отдачу вакансий
    if (!hhru_data.hasOwnProperty("items")) {
        return {
            vacancies: [],
            found: 0,
            pages: 0
        }
    }
    else {
        let processed_array: HHRuVacancy[] = []

        for (let item of hhru_data.items) {
            if (Number(queryData.page) != 1) {
                await sleep(getRandomNumber(100, 200))
            }

            // Получение конкретной вакансии для описания
            let certain_vacancy
            const certain_vacancy_res = await fetch(`https://api.hh.ru/vacancies/${item.id}`, {
                headers: {
                    "User-Agent": "Diplom (novikovga03@gmail.com)"
                }
            })
        
            certain_vacancy = await certain_vacancy_res.json()

            while ("errors" in certain_vacancy) {
                console.log("Captcha on HHRU")
                await sleep(10000)

                const certain_vacancy_res = await fetch(`https://api.hh.ru/vacancies/${item.id}`, {
                    headers: {
                        "User-Agent": "Diplom (novikovga03@gmail.com)"
                    }
                })
            
                certain_vacancy = await certain_vacancy_res.json()
            }

            let vacancy: HHRuVacancy = {
                vacancy_id: item.alternate_url,
                type: "HHRU",
                title: item.name,
                salary: processSalary(item.salary.from, item.salary.to),
                currency: item.salary.currency,
                experience: item.experience.name,
                description: (certain_vacancy.description.replace(/<\/?[^>]+(>|$)/g, "")).replaceAll("&quot;", ""),
                url: item.alternate_url
            }

            processed_array.push(vacancy)
        }

        return {
            vacancies: processed_array,
            found: hhru_data.found,
            pages: hhru_data.pages
        }
    }
}



function processSalary(from: number, to: number) {
    if (from == null) {
        return to.toString()
    }

    if (to == null) {
        return from.toString()
    }

    if (from == to) {
        return from.toString()
    }

    return `${from} - ${to}`
}

function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}