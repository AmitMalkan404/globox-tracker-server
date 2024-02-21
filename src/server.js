import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import axios from 'axios';

let userId="123"
const app = express();
app.use(bodyParser.json());
app.use(cors());

import connectToDatabase from './db.services/dbConnectivity.js';
import addPackageRoute from './routes/addPackageId.js';
import getPackageTrackingDataById from './services/packageTracking.service.js';
import addPackageToDB from './db.services/packageAddition.service.js';

app.use('/add-package',addPackageRoute);

const port = 1818;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectToDatabase().catch(console.dir);
  getPackageTrackingDataById("RS0858060906Y",userId);
});


// var config = {
//   method: 'get',
//   url: 'https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=YOUR_API_KEY',
//   headers: { }
// };

// axios(config)
// .then(function (response) {
//   console.log(response.data);
// })
// .catch(function (error) {
//   console.log(error);
// });