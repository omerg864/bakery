import { UserEntity } from '@shared/types/user.entity';
import userModel, { UserEntityDocument } from '../models/user.model';

const getUserById = async (
	userId: string
): Promise<UserEntityDocument | null> => {
	const user = await userModel.findById(userId);
	return user;
};

const getUserByEmail = async (
	email: string
): Promise<UserEntityDocument | null> => {
	const searchQuery = { email: new RegExp(`^${email}$`, 'i') };
	const user = await userModel.findOne(searchQuery);
	return user;
}

export const getUserByResetPasswordToken = async (
	token: string
): Promise<UserEntityDocument | null> => {
	const user = await userModel.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: new Date() },
	});
	return user;
};

const createUser = async (
	userData: Partial<UserEntity>
): Promise<UserEntityDocument> => {
	const user = new userModel(userData);
	await user.save();
	return user;
};

const updateUser = async (
	userId: string,
	userData: Omit<Partial<UserEntityDocument>, 'id'>
): Promise<UserEntityDocument | null> => {
	const user = await userModel.findByIdAndUpdate(
		userId,
		{ $set: userData },
		{ new: true }
	);
	return user;
}

export { getUserById, getUserByEmail, createUser, updateUser };
