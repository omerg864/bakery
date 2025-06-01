import userModel, { UserEntityDocument } from '../models/user.model';

const getUserById = async (
	userId: string
): Promise<UserEntityDocument | null> => {
	const user = await userModel.findById(userId);
	return user;
};

export { getUserById };
