import { createTransport } from 'nodemailer';
import logger from '../config/logger';
import {
	EMAIL_ADDRESS,
	EMAIL_PASSWORD,
	EMAIL_SERVICE,
	EMAIL_USERNAME,
} from '../config/env';

type SendEmailOptions = {
	receiver: string | string[];
	subject: string;
	text?: string;
	html?: string;
};

export async function sendEmail({
	receiver,
	subject,
	text,
	html,
}: SendEmailOptions): Promise<boolean> {
	if (
		!EMAIL_SERVICE ||
		!EMAIL_USERNAME ||
		!EMAIL_PASSWORD ||
		!EMAIL_ADDRESS
	) {
		logger.error('Missing email configuration in environment variables.');
		return false;
	}

	const transporter = createTransport({
		service: EMAIL_SERVICE,
		auth: {
			user: EMAIL_USERNAME,
			pass: EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: EMAIL_ADDRESS,
		to: Array.isArray(receiver) ? receiver.join(',') : receiver,
		subject,
		text,
		html,
	};

	let success = false;

	for (let attempt = 1; attempt <= 3 && !success; attempt++) {
		try {
			await transporter.sendMail(mailOptions);
			success = true;
		} catch (error) {
			logger.error(`Email send failed (attempt ${attempt}):`, error);
			if (attempt < 3) {
				logger.info(`Retrying email send to: ${mailOptions.to}`);
			}
		}
	}

	return success;
}
