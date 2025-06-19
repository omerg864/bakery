import { UserEntity } from '@shared/types/user.entity';
import { Document, model, Schema } from 'mongoose';
import { EntityFunctions } from '../types/entity';

export type UserEntityDocumentData = {
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
};
export interface UserEntityDocument
	extends UserEntity,
		EntityFunctions<UserEntity>,
		UserEntityDocumentData,
		Omit<Document, 'id'> {}

const userSchema = new Schema<UserEntityDocument>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: {
			type: String,
			default: null,
		},
		resetPasswordExpires: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

userSchema.methods.getEntity = function (): Partial<UserEntity> {
	return {
		id: this._id.toString(),
		name: this.name,
		email: this.email,
		createdAt: this.createdAt,
	};
};

export default model<UserEntityDocument>('User', userSchema);
