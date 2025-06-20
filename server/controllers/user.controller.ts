import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
	const { email, password, name } = req.body;
};

export const changePassword = async (req: Request, res: Response) => {};

export const resetPassword = async (req: Request, res: Response) => {};

export const sendResetPasswordEmail = async (email: string) => {};

export const updateUserData = async (req: Request, res: Response) => {};

export const resendVerificationEmail = async (
	req: Request,
	res: Response
) => {};
