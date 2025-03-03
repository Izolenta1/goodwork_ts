import type { Metadata } from "next";
import VacancyWrapper from "@/components/VacancyComponents/VacancyWrapper";

interface Params {
    min_salary?: string,
    max_salary?: string,
    min_exp?: string,
    max_exp?: string,
    search?: string
}

interface VacancyProps {
    searchParams: Promise<Params>
}

export const metadata: Metadata = {
	title: "Вакансии",
};

export default async function Vacancy({ searchParams }: VacancyProps) {
    let new_url = new URL(`${process.env.BACKEND_URI}/api/vacancy/getAllCavancies`);
    let params = await searchParams
    let FilterParams: Params = {}
    if (params.min_salary) {
        new_url.searchParams.append('min_salary', params.min_salary)
        FilterParams["min_salary"] = params.min_salary
    }
    if (params.max_salary) {
        new_url.searchParams.append('max_salary', params.max_salary)
        FilterParams["max_salary"] = params.max_salary
    }
    if (params.min_exp) {
        new_url.searchParams.append('min_exp', params.min_exp)
        FilterParams["min_exp"] = params.min_exp
    }
    if (params.max_exp) {
        new_url.searchParams.append('max_exp', params.max_exp)
        FilterParams["max_exp"] = params.max_exp
    }
    if (params.search) {
        new_url.searchParams.append('search', params.search)
        FilterParams["search"] = params.search
    }

    const vacanciesRes = await fetch(new_url.href)
    const vacanciesData = await vacanciesRes.json()

    let VacanciesList = vacanciesData.payload.result
    let VacanciesNext = vacanciesData.payload.next

    return (
        <main className="grow flex flex-col items-center">
            <VacancyWrapper key={JSON.stringify(params)} VacanciesList={VacanciesList} VacanciesNext={VacanciesNext} FilterParams={FilterParams}></VacancyWrapper>
        </main>
    );
}