import { connectMongoDB } from './config/mongoDB';
import app from './app';
import { PORT } from './config/env';
import colors from 'colors';

const startServer = (): void => {
	app.listen(PORT, () => {
		console.log(colors.green.bold(`Server is running on port ${PORT}`));
	});
};

connectMongoDB(startServer);
