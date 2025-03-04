import FavouriteWrapper from "@/components/FavouriteComponents/FavouriteWrapper";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Избранные вакансии",
};

export default async function Favourite() {
    const verifyURL = `${process.env.BACKEND_URI}/auth/verifySession`
    const verifyRes = await fetch(verifyURL, {
        method: "POST",
        headers: await headers(),
    })
    const verifyData = await verifyRes.json()

    if (verifyData.status == 401) {
        redirect('/');
    }

    if (verifyData.payload.role != "employee") {
        redirect('/');
    }

    const vacanciesRes = await fetch(`${process.env.BACKEND_URI}/api/vacancy/favourite`, {
        method: "GET",
        headers: await headers(),
    })
    const VacanciesList = await vacanciesRes.json()

    return (
        <main className="grow flex flex-col items-center">
            <FavouriteWrapper VacanciesList={VacanciesList.payload}></FavouriteWrapper>
        </main>
    );
}