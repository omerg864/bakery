export type OptionValue = {
	id: string;
	name: string;
	description?: string;
	price: number;
	imageUrl?: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export type AddOnEntity = {
	id: string;
	name: string;
	description?: string;
	required: boolean;
	options: OptionValue[];
	imageUrl?: string;
	createdAt?: Date;
	updatedAt?: Date;
};
