import { SessionData } from "@pr_types/auth_types";

declare global {
	namespace Express {
		export interface Request {
			session_data?: SessionData;
			session_id?: string;
		}
	}
}