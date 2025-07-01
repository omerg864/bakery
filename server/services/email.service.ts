import {
	EMAIL_SUBJECT_TEXTS,
	EMAIL_SUBJECT_TITLES,
} from './../constants/email.constants';
import {
	EMAIL_SUBJECT_TEMPLATES,
	EmailSubjects,
} from '../constants/email.constants';
import ejs from 'ejs';
import fs from 'fs/promises';
import { sendEmail } from '../utils/email.utils';
import { TemplateParamsMap } from '../types/email';

export const sendEmailTemplate = async <T extends EmailSubjects>(
	receiver: string[] | string,
	subject: T,
	params: TemplateParamsMap[T]
): Promise<boolean> => {
	const template = await fs.readFile(
		`../templates/${EMAIL_SUBJECT_TEMPLATES[subject]}`,
		'utf8'
	);
	const html = ejs.render(template, params);
	const sent = await sendEmail({
		receiver,
		subject: EMAIL_SUBJECT_TITLES[subject],
		text: EMAIL_SUBJECT_TEXTS[subject],
		html,
	});
	return sent;
};
