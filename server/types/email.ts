import { EmailSubjects } from '../constants/email.constants';

export type TemplateParamsMap = {
	[EmailSubjects.VERIFY_EMAIL]: {
		name: string;
		verificationLink: string;
	};
	[EmailSubjects.RESET_PASSWORD]: {
		name: string;
		resetLink: string;
		expirationTime: string;
	};
};
