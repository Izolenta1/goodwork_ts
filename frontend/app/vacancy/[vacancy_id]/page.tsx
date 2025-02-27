import { headers } from "next/headers";
import CertainVacancyWrapper from "@/components/CertainVacancyComponents/CertainVacancyWrapper";

interface CertainVacancyProps {
    params: Promise<{ vacancy_id: number }>
}

export async function generateMetadata({ params }: CertainVacancyProps) {
    let vacancy_id = (await params).vacancy_id

    const vacancyRes = await fetch(`http://localhost:3001/api/vacancy/getVacancyById?vacancy_id=${vacancy_id}`)
    const vacancyData = (await vacancyRes.json())["payload"]

    return {
        title: vacancyData.title,
    }
}

export default async function CertainVacancy({ params }: CertainVacancyProps) {
    let vacancy_id = (await params).vacancy_id

    const vacancyRes = await fetch(`http://localhost:3001/api/vacancy/getVacancyById?vacancy_id=${vacancy_id}`)
    const vacancyData = (await vacancyRes.json())["payload"]

    // Проверка на добавленное в отклик
    let responseURL = `http://localhost:3001/api/response?vacancy_id=${vacancy_id}`
    const responseRes = await fetch(responseURL, {
        method: "GET",
        headers: await headers(),
    })
    const responseData = await responseRes.json()

    let isResponseSet = false
    if (responseData.payload) {
        if (responseData.status == 200) {
            isResponseSet = true
        }
    }
    else {
        isResponseSet = false
    }

    // Проверка на добавленное в избранное
    let favouriteURL = `http://localhost:3001/api/favourite?vacancy_id=${vacancy_id}`
    const favouriteRes = await fetch(favouriteURL, {
        method: "GET",
        headers: await headers(),
    })
    const favouriteData = await favouriteRes.json()

    let isfavouriteSet = false
    if (favouriteData.payload) {
        if (favouriteData.status == 200) {
            isfavouriteSet = true
        }
    }
    else {
        isfavouriteSet = false
    }

    const CommentRes = await fetch(`http://localhost:3001/api/vacancy/feedback?vacancy_id=${vacancy_id}`)
    const CommentList = (await CommentRes.json())["payload"]

    return (
        <main className="grow flex flex-col items-center">
            <CertainVacancyWrapper key={vacancy_id} vacancyData={vacancyData} isResponseSet={isResponseSet} isfavouriteSet={isfavouriteSet} CommentList={CommentList}></CertainVacancyWrapper>
        </main>
    );
}