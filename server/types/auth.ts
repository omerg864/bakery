import { DeviceInfo } from '@shared/types/auth.entity';
import { ObjectId } from 'mongoose';

export type AuthEntity = DeviceInfo & {
	userId: string | ObjectId;
	token: string;
	expiresAt: Date | string;
};
