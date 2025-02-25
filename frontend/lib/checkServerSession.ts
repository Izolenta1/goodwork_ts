import { cookies, headers } from "next/headers";

export async function checkServerSession() {
    const user_cookies = await cookies()
    const user_session = user_cookies.get("goodwork_session")?.value;

    if (!user_session) return null;

    // Делаем запрос к API сервера, чтобы получить данные о пользователе
    const res = await fetch(`${process.env.BACKEND_URI}/auth/verifySession`, {
        method: "POST",
        headers: await headers(),
        cache: 'no-store'
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.status === 200 ? data.payload : null;
}