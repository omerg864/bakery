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

const createUser = async (
	userData: Partial<UserEntityDocument>
): Promise<UserEntityDocument> => {
	const user = new userModel(userData);
	await user.save();
	return user;
};

const updateUser = async (
	userId: string,
	userData: Partial<UserEntityDocument>
): Promise<UserEntityDocument | null> => {
	const user = await userModel.findByIdAndUpdate(
		userId,
		{ $set: userData },
		{ new: true }
	);
	return user;
}

export { getUserById, getUserByEmail, createUser, updateUser };
