import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { checkServerSession } from "@/lib/checkServerSession";
import type { Metadata } from "next";

export const metadata: Metadata = {
    icons: {
        icon: "/favicon.ico"
    },
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await checkServerSession();

	return (
		<AuthProvider serverUser={user}>
			<html lang="ru">
				<body className="flex flex-col min-h-[100vh]">
					<Header />
					{children}
					<Footer />
				</body>
			</html>
		</AuthProvider>
	);
}
