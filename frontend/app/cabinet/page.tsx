import EmployeeWrapper from "@/components/CabinetComponents/EmployeeWrapper";
import EmployerWrapper from "@/components/CabinetComponents/EmployerWrapper";
import { EmployerCabinetProvider } from "@/context/EmployerCabinetContext";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Личный кабинет",
};

export default async function Cabinet() {
    let verifyURL = `http://localhost:3001/auth/verifySession`
    const verifyRes = await fetch(verifyURL, {
        method: "POST",
        headers: await headers(),
    })
    const verifyData = await verifyRes.json()

    if (verifyData.status == 401) {
        redirect('/');
    }

    let UserRole: string = verifyData.payload.role

    return (
        <main className="grow flex flex-col items-center">
            {UserRole == "employee" 
            ? <EmployeeWrapper key={UserRole} /> 
            : <EmployerCabinetProvider>
                <EmployerWrapper key={UserRole} />
            </EmployerCabinetProvider>}
        </main>
    );
}