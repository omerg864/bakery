export enum EmailSubjects {
	VERIFY_EMAIL = 'verify-email',
    RESET_PASSWORD = 'reset-password',
}

export const EMAIL_SUBJECT_TEMPLATES: Record<EmailSubjects, string> = {
	[EmailSubjects.VERIFY_EMAIL]: '../templates/confirmEmail.ejs',
    [EmailSubjects.RESET_PASSWORD]: '../templates/resetPassword.ejs',
};

export const EMAIL_SUBJECT_TEXTS: Record<EmailSubjects, string> = {
    [EmailSubjects.VERIFY_EMAIL]: 'Please verify your email address',
    [EmailSubjects.RESET_PASSWORD]: 'Reset your password',
};

export const EMAIL_SUBJECT_TITLES: Record<EmailSubjects, string> = {
    [EmailSubjects.VERIFY_EMAIL]: 'Email Verification',
    [EmailSubjects.RESET_PASSWORD]: 'Password Reset Request',
};