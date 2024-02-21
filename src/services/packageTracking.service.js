import { PythonShell } from 'python-shell';
import iconv from 'iconv-lite';
import dotenv from 'dotenv';
import addPackageToDB from '../db.services/packageAddition.service.js';

dotenv.config();

const parseReceivedString = (receivedString) => {
    receivedString = receivedString.replaceAll(/\\/g, '');
    // receivedString = receivedString.slice(2, -1);
  
    try {
      // Decode the received string using iconv-lite
      const decodedString = iconv.decode(Buffer.from(receivedString, 'binary'), 'ISO-8859-8');
      const jsonObject = JSON.parse(decodedString.replace(/ 0+(?![\. }])/g, ' '));
      if (jsonObject["0"]!=="error"){
        return jsonObject;
      }
      throw jsonObject.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  

const getPackageTrackingDataById = async (trackingId,userId) => {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: process.env.path_to_python,
    scriptPath: process.env.path_to_script,
    args: [trackingId],
    encoding: 'utf8',
  };

  PythonShell.run(process.env.script_name, options)
    .then((result) => {
        if (result && result.length > 0) {
            const parsedData = parseReceivedString(result[0]);
            if (parsedData) {
              // Use parsedData here (it contains the transformed JSON-like object)
              let packageData = {}
              packageData["tracking_info"] = parsedData;
              packageData["user_id"] = userId;
              packageData["tracking_id"] = trackingId;
            //   return parsedData;
              addPackageToDB(packageData);
            } else {
              // Handle JSON parsing error
              console.error('Failed to parse JSON-like data');
            }
          } else {
            console.error('Empty result received');
          }
    })
    .catch((err) => {
      console.error(err);
      // Handle PythonShell execution error
    });
};

export default getPackageTrackingDataById;
