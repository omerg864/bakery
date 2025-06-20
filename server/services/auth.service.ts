import authModel, { AuthEntityDocument } from '../models/auth.model';
import { AuthEntity } from '../types/auth';
import { subMilliseconds } from 'date-fns';
import { MAX_SESSION_DURATION } from '../constants/auth.constants';

export const findAuthByToken = async (
	token: string
): Promise<AuthEntityDocument | null> => {
	return authModel.findOne({ token });
};

export const findAuthByUserId = async (
	userId: string
): Promise<AuthEntityDocument | null> => {
	return authModel.findOne({ userId });
};

export const findAuthByUserIdAndDeviceId = async (
	userId: string,
	deviceId: string
): Promise<AuthEntityDocument | null> => {
	return authModel.findOne({ userId, deviceId });
};

export const createAuth = async (
	authData: AuthEntity
): Promise<AuthEntityDocument | null> => {
	const auth = new authModel(authData);
	return auth.save();
};

export const updateAuth = async (
	userId: string,
	deviceId: string,
	token: string,
	expiresAt?: Date
): Promise<AuthEntityDocument | null> => {
	const updateQuery: { token: string; expiresAt?: Date } = { token };
	if (expiresAt) {
		updateQuery['expiresAt'] = expiresAt;
	}
	return await authModel.findOneAndUpdate({ userId, deviceId }, updateQuery);
};

export const removeAuth = async (
	token: string,
	userId: string
): Promise<void> => {
	await authModel.findOneAndDelete({ token, userId });
};

export const removeUserExpiredAuth = async (userId: string): Promise<void> => {
	const cutoffDate = subMilliseconds(new Date(), MAX_SESSION_DURATION);

	await authModel.deleteMany({
		userId,
		createdAt: { $lt: cutoffDate },
	});
};
