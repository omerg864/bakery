export enum EmailSubjects {
	VERIFY_EMAIL = 'verify-email',
}

export const EMAIL_SUBJECT_TEMPLATES: Record<EmailSubjects, string> = {
	[EmailSubjects.VERIFY_EMAIL]: '../templates/confirmEmail.ejs',
};

export const EMAIL_SUBJECT_TEXTS: Record<EmailSubjects, string> = {
    [EmailSubjects.VERIFY_EMAIL]: 'Please verify your email address',
};

export const EMAIL_SUBJECT_TITLES: Record<EmailSubjects, string> = {
    [EmailSubjects.VERIFY_EMAIL]: 'Email Verification',
};