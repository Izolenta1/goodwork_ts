import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface VerifyProps {
	params: Promise<{ verify_id: string }>;
}

export const metadata: Metadata = {
	title: "Верификация пользователя",
};

export default async function Verify({ params }: VerifyProps) {
	const verify_id = (await params).verify_id;

	// Проверка ID
	if (verify_id.length != 128) {
		redirect("/404");
	}

	// Данные для отправки
	let verifyData = {
		verify_id: verify_id,
	};

	const response = await fetch(`${process.env.BACKEND_URI}/auth/register/verify`, {
		method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
		body: JSON.stringify(verifyData)
	});
	const verify_data = await response.json();

	return (
		<main className="flex justify-center grow pt-[20px]">
			{/* Враппер под 1140px для страницы верификации */}

			<div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
				<div className="flex flex-col mt-[16px] gap-[8px]">
					<span className="text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]">{verify_data.payload}</span>
					<div className="w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]"></div>
				</div>
			</div>
		</main>
	);
}
