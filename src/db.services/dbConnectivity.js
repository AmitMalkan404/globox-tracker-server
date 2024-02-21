import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';


dotenv.config();

const user = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
export const databaseUrl = 'mongodb+srv://'+user+':'+password+'@cluster0.qn5ie0c.mongodb.net/?retryWrites=true&w=majority';
export const clientInstance = new MongoClient(databaseUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

export async function connectToDatabase() {
  try {
    await clientInstance.connect();
    await clientInstance.db("admin").command({ ping: 1 });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

export default connectToDatabase; // Export the function
