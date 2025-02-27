import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ResponsesWrapper from "@/components/CabinetComponents/ResponsesComponents/ResponsesWrapper";

interface ResponsesProps {
    params: Promise<{ vacancy_id: number }>
}

export async function generateMetadata({ params }: ResponsesProps) {
    let vacancy_id = (await params).vacancy_id

    const vacancyRes = await fetch(`http://localhost:3001/api/vacancy/getVacancyById?vacancy_id=${vacancy_id}`)
    const vacancyData = (await vacancyRes.json())["payload"]

    return {
        title: `Отклики вакансии «${vacancyData.title}»`,
    }
}

export default async function Responses({ params }: ResponsesProps) {
    let vacancy_id = (await params).vacancy_id

    let verifyURL = `http://localhost:3001/auth/verifySession`
    const verifyRes = await fetch(verifyURL, {
        method: "POST",
        headers: await headers(),
    })
    const verifyData = await verifyRes.json()

    if (verifyData.status == 401) {
        redirect('/');
    }

    if (verifyData.payload.role != "employer") {
        redirect('/');
    }

    const vacancyRes = await fetch(`http://localhost:3001/api/vacancy/getVacancyById?vacancy_id=${vacancy_id}`)
    const vacancyData = await vacancyRes.json()

    const resumesRes = await fetch(`http://localhost:3001/api/vacancy/response?vacancy_id=${vacancy_id}`, {
        method: "GET",
        headers: await headers(),
    })
    const resumesData = await resumesRes.json()

    return (
        <main className="grow flex flex-col items-center">
            <ResponsesWrapper VacancyData={vacancyData.payload} ResumesList={resumesData.payload}></ResponsesWrapper>
        </main>
    );
}