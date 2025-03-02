import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()

const transporter = nodemailer.createTransport(
	{
		host: "smtp.yandex.ru",
		port: 587,
		auth: {
			user: process.env.MAIL_EMAIL,
			pass: process.env.MAIL_PASSWORD,
		},
	},
	{
		from: "GoodWork <odnorazovaya33@yandex.ru>",
	}
);

export default transporter