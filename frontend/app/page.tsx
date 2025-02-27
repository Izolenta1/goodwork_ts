import IndexWrapper from "@/components/IndexComponents/IndexWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Главная",
};

export default function Home() {
	return (
		<main className="grow flex flex-col items-center">
			<IndexWrapper></IndexWrapper>
		</main>
	);
}
