export type UserEntity = {
	id: string;
	email: string;
	password?: string;
	name: string;
	isEmailVerified?: boolean;
	createdAt?: Date | string;
	updatedAt?: Date;
};
