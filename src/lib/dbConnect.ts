import mongoose from 'mongoose';



type connectionObject = {
    isConnected: boolean;
};

const connection: connectionObject = {
    isConnected: false,
};

async function dbConnect(): Promise<void>{
    if (connection.isConnected) {
        console.log('Already connected to database');
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        const uri = process.env.MONGODB_URI.endsWith('/') 
            ? process.env.MONGODB_URI.slice(0, -1) 
            : process.env.MONGODB_URI;
        await mongoose.connect(`${uri}/${process.env.MONGODB_DB_NAME}`);
        connection.isConnected = true;
        console.log('Connected to database');
    } catch (error) {
        connection.isConnected = false;
        console.error('Error connecting to database:', error);
        throw error;
    }
}

export default dbConnect;