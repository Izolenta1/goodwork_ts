import EditVacancyWrapper from "@/components/CabinetComponents/VacancyComponents/EditVacancyWrapper";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface EditProps {
    params: Promise<{ vacancy_id: number }>
}

interface Vacancy {
    vacancy_id: number,
    title: string,
    salary: number,
    experience: number,
    description: string,
    user_id: number
}

export const metadata: Metadata = {
	title: "Редактировать вакансию",
};

export default async function Edit({ params }: EditProps) {
    const vacancy_id = (await params).vacancy_id

    const verifyURL = `${process.env.BACKEND_URI}/auth/verifySession`
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

    const vacanciesRes = await fetch(`${process.env.BACKEND_URI}/api/vacancy/getUserVacancies`, {
        method: "GET",
        headers: await headers(),
    })
    const vacanciesData = await vacanciesRes.json()

    const result_array = vacanciesData.payload.filter((vacancy: Vacancy) => vacancy.vacancy_id == vacancy_id)
    if (result_array.length == 0) {
        redirect('/');
    }

    return (
        <main className="grow flex flex-col items-center">
            <EditVacancyWrapper key={vacancy_id} VacancyID={vacancy_id} VacancyData={result_array[0]}></EditVacancyWrapper>
        </main>
    );
}