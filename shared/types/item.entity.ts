export type ItemEntity = {
	id: string;
	name: string;
	basePrice: number;
	description?: string;
	imageUrl?: string;
	createdAt?: Date;
	updatedAt?: Date;
	categoryId?: string;
	addOnsIds: string[];
};
