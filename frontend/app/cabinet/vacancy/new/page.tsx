import NewVacancyWrapper from "@/components/CabinetComponents/VacancyComponents/NewVacancyWrapper";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Добавить вакансию",
};

export default async function New() {
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

    return (
        <main className="grow flex flex-col items-center">
            <NewVacancyWrapper></NewVacancyWrapper>
        </main>
    );
}