import type { Metadata } from "next";
import { redirect } from "next/navigation";

import RecoveryWrapper from "@/components/RecoveryComponents/RecoveryWrapper";

interface RecoveryProps {
	params: Promise<{ recovery_id: string }>;
}

export const metadata: Metadata = {
	title: "Верификация пользователя",
};

export default async function Recovery({ params }: RecoveryProps) {
	const recovery_id = (await params).recovery_id;

	// Первая проверка ID
	if (recovery_id.length != 128) {
		redirect("/404")
	}

	// Данные для отправки
	const recoveryData = {
		recovery_id: recovery_id,
	};

    const response = await fetch(`${process.env.BACKEND_URI}/auth/recovery/verify`, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(recoveryData),
        cache: 'no-store'
    })
    const verify_data = await response.json()

    // Вторая проверка ID
    if (verify_data.payload == 'Not verified') {
        redirect("/404")
    }

	return (
		<main className="flex justify-center grow pt-[20px]">
            <RecoveryWrapper recovery_id={verify_data.recovery_id}></RecoveryWrapper>
		</main>
	);
}
