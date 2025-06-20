
export type EntityFunctions<T> = {
    getEntity: () => Partial<T>;
}

export type TimestampsData = {
    createdAt: Date;
    updatedAt: Date;
}