export type UserEntity = {
	id: string;
	email: string;
	password?: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
};
