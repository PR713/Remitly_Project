import app from './index';
import mongoose from 'mongoose';

const port: number = parseInt(process.env.APP_PORT ?? '8080', 10);

if (process.env.NODE_ENV !== "test") {
    const server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    process.on('SIGINT', () => {
        server.close(() => {
            mongoose.connection.close().then(() => {
                console.log('Server and MongoDB connection closed');
                process.exit(0);
            });
        });
    });
}