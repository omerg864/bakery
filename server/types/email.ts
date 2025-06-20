import { EmailSubjects } from '../constants/email.constants';

export type TemplateParamsMap = {
	[EmailSubjects.VERIFY_EMAIL]: {
		userName: string;
		verificationLink: string;
	};
};
