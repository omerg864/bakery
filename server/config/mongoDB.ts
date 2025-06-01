import mongoose from 'mongoose';
import colors from 'colors';
import { MONGO_URI } from './env';

async function connectMongoDB(startServer: () => void): Promise<void> {
	try {
		const conn = await mongoose.connect(MONGO_URI);
		console.log(
			colors.green.underline(`MongoDB Connected: ${conn.connection.host}`)
		);
		startServer();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

export { connectMongoDB };
