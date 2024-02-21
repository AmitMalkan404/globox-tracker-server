import { clientInstance } from '../db.services/dbConnectivity.js';
import dotenv from 'dotenv';

dotenv.config();

async function addPackageToDB(packageData) {
  try {
    // Use the existing client instance from dbConnect.js
    const client = clientInstance;
    // Ensure that the client is connected to the database
    if (!client) {
      await client.connect();
    }

    // Insert flight data into the database
    const database = client.db(process.env.DB_NAME);
    const collection = database.collection(process.env.COLLECTION_NAME);
    
    let returned_id = null;
    await collection.findOne({user_id:packageData.user_id, tracking_id:packageData.tracking_id}).then((result) => {
        if (result){
            throw "Package already exists for the user"
        }
        collection.insertOne(packageData).then(result => {
            returned_id = result.insertedId.toString();
          });
    })
    

    console.log('package data added to the database');
    return returned_id;
  } catch (error) {
    console.error( 'Error adding package data to the database:', error);
  }
}

export default addPackageToDB ;
