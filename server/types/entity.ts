export type EntityFunctions<T, K extends keyof T = never, E = {}> = {
	getEntity: () => Partial<T> & Pick<T, K> & E;
};

export type TimestampsData = {
	createdAt: Date;
	updatedAt: Date;
};
