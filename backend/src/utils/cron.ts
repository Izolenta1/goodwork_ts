import pool from "@controllers/database_controller";

export async function clearTemporaryValues() {
    
    // Удаление устаревших сессий
    try {
        await pool.execute(`DELETE FROM sessions WHERE create_date < now() - interval 604800 second`);
    } catch (error) {
        console.log("Database query error:", error);
    }

    // Удаление неподтвержденных аккаунтов
    try {
        await pool.execute(`DELETE FROM verify WHERE create_date < now() - interval 3600 second`);
    } catch (error) {
        console.log("Database query error:", error);
    }

    // Удаление запросов смены пароля
    try {
        await pool.execute(`DELETE FROM recovery WHERE create_date < now() - interval 3600 second`);
    } catch (error) {
        console.log("Database query error:", error);
    }
}