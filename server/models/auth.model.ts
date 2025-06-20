import { Document, model, Schema } from 'mongoose';
import { EntityFunctions, TimestampsData } from '../types/entity';
import { AuthEntity } from '../types/auth';

export interface AuthEntityDocument
	extends AuthEntity,
		TimestampsData,
		EntityFunctions<AuthEntity>,
		Omit<Document, 'id'> {}

const authSchema = new Schema<AuthEntityDocument>(
	{
		deviceName: {
			type: String,
			required: true,
			trim: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		deviceId: {
			type: String,
			required: true,
		},
		deviceType: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

// indexes
authSchema.index({ userId: 1 });
authSchema.index({ token: 1 });
authSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

// Methods
authSchema.methods.getEntity = function (): AuthEntity & TimestampsData {
	return {
		deviceId: this.deviceId,
		deviceName: this.deviceName,
		deviceType: this.deviceType,
		userId: this.userId,
		token: this.token,
		expiresAt: this.expiresAt,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};

export default model<AuthEntityDocument>('Auth', authSchema);
