import { Request, Response } from 'express';

const register = async (req: Request, res: Response) => {
	const { email, password, name } = req.body;
};

const login = async (req: Request, res: Response) => {};

const logout = async (req: Request, res: Response) => {};

const googleAuth = async (req: Request, res: Response) => {};

const changePassword = async (req: Request, res: Response) => {};

const resetPassword = async (req: Request, res: Response) => {};

const sendResetPasswordEmail = async (email: string) => {};

const updateUserData = async (req: Request, res: Response) => {};

const resendVerificationEmail = async (req: Request, res: Response) => {};

export {
	register,
	login,
	logout,
	googleAuth,
	changePassword,
	resetPassword,
	sendResetPasswordEmail,
	updateUserData,
	resendVerificationEmail,
};
