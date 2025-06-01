import { UserEntity } from '@shared/types/user.entity';
import { Request } from 'express';

export type RequestWithUser = Request & {
	user: UserEntity;
};
