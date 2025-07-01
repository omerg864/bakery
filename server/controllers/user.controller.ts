import {
	ChangePasswordSchemaType,
	ResendVerificationEmailSchemaType,
	ResetPasswordSchemaType,
	SendResetPasswordEmailSchemaType,
	UpdateUserDataSchemaType,
	RegisterSchemaType
} from '@shared/schemas/userSchemas/userRequests.schema';
import { CLIENT_ROUTES } from '@shared/constants/routes.constants';
import type { Request, Response } from 'express';
import {
	createUser,
	getUserByEmail,
	updateUser,
	getUserByResetPasswordToken,
} from '../services/user.service';
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	ServerError,
} from '../utils/error.utils';
import { UserEntity } from '@shared/types/user.entity';
import { sendEmailTemplate } from '../services/email.service';
import { EmailSubjects } from '../constants/email.constants';
import { generateLink } from '@shared/services/app.shared-service';
import { CLIENT_URL } from '../config/env';
import { RequestWithUser } from '../types/express';
import { compareBcrypt, hashBcrypt } from '../utils/encrypt.utils';
import { RESET_PASSWORD_TOKEN_EXPIRATION_MS } from '../constants/auth.constants';
import { durationFormatter } from '../utils/datetime.utils';
import { v4 as uuid } from 'uuid';

export const register = async (req: Request, res: Response) => {
	const { email, password, name }: RegisterSchemaType = req.body;

	const userFound = await getUserByEmail(email);
	if (userFound) {
		throw new BadRequestError('Email already registered');
	}

	const newUser = {
		email,
		password,
		name,
	} satisfies Partial<UserEntity>;
	const userDocument = await createUser(newUser);

	const verificationLink = generateLink(CLIENT_URL, [
		CLIENT_ROUTES.VERIFY_EMAIL,
		userDocument.id,
	]);

	const sent = await sendEmailTemplate(
		userDocument.email,
		EmailSubjects.VERIFY_EMAIL,
		{
			name: userDocument.name,
			verificationLink,
		}
	);
	res.status(201).json({
		success: true,
		sent,
	});
};

export const changePassword = async (req: RequestWithUser, res: Response) => {
	const { currentPassword, newPassword }: ChangePasswordSchemaType = req.body;
	const user = req.user!;

	if (user.password) {
		if (!currentPassword) {
			throw new BadRequestError('Current password is required');
		}
		const isOldPasswordValid = await compareBcrypt(
			currentPassword,
			user.password
		);
		if (!isOldPasswordValid) {
			throw new ForbiddenError('Old password is incorrect');
		}
	}

	const hashedPassword = await hashBcrypt(newPassword);

	const updatedUser = await updateUser(user.id, {
		password: hashedPassword,
	});
	if (!updatedUser) {
		throw new ServerError('Failed to update password');
	}

	res.status(200).json({
		success: true,
		user: updatedUser.getEntity(),
	});
};

export const resetPassword = async (req: Request, res: Response) => {
	const { resetPasswordToken, newPassword }: ResetPasswordSchemaType =
		req.body;

	const hashedResetPasswordToken = await hashBcrypt(resetPasswordToken);
	const user = await getUserByResetPasswordToken(hashedResetPasswordToken);
	if (!user) {
		throw new BadRequestError('Invalid or expired reset token');
	}

	const hashedPassword = await hashBcrypt(newPassword);

	const updatedUser = await updateUser(user.id, {
		password: hashedPassword,
		resetPasswordToken: undefined,
		resetPasswordExpires: undefined,
	});

	if (!updatedUser) {
		throw new ServerError('Failed to reset password');
	}

	res.status(200).json({
		success: true,
	});
};

export const sendResetPasswordEmail = async (req: Request, res: Response) => {
	const { email }: SendResetPasswordEmailSchemaType = req.body;

	const user = await getUserByEmail(email);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	const resetToken = `${uuid()}-${user.id}`;
	const hashedResetToken = await hashBcrypt(resetToken);
	const updatedUser = await updateUser(user.id, {
		resetPasswordToken: hashedResetToken,
		resetPasswordExpires: new Date(
			Date.now() + RESET_PASSWORD_TOKEN_EXPIRATION_MS
		),
	});

	if (!updatedUser) {
		throw new ServerError('Failed to update user for reset token');
	}

	const resetLink = generateLink(CLIENT_URL, [
		CLIENT_ROUTES.RESET_PASSWORD,
		resetToken,
	]);

	const sent = await sendEmailTemplate(
		user.email,
		EmailSubjects.RESET_PASSWORD,
		{
			name: user.name,
			resetLink,
			expirationTime: durationFormatter(
				RESET_PASSWORD_TOKEN_EXPIRATION_MS
			),
		}
	);

	res.status(200).json({
		success: true,
		sent,
	});
};

export const updateUserData = async (req: RequestWithUser, res: Response) => {
	const { name }: UpdateUserDataSchemaType = req.body;
	const user = req.user!;

	const updatedUser = await updateUser(user.id, {
		name: name || user.name,
	});

	if (!updatedUser) {
		throw new ServerError('Failed to update user data');
	}

	res.status(200).json({
		success: true,
		user: updatedUser.getEntity(),
	});
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
	const { email }: ResendVerificationEmailSchemaType = req.body;
	const userDocument = await getUserByEmail(email);
	if (!userDocument) {
		throw new NotFoundError('User not found');
	}
	if (userDocument.isEmailVerified) {
		throw new BadRequestError('Email already verified');
	}

	const verificationLink = generateLink(CLIENT_URL, [
		CLIENT_ROUTES.VERIFY_EMAIL,
		userDocument.id,
	]);

	const sent = await sendEmailTemplate(
		userDocument.email,
		EmailSubjects.VERIFY_EMAIL,
		{
			name: userDocument.name,
			verificationLink,
		}
	);

	res.status(200).json({
		success: true,
		sent,
	});
};
