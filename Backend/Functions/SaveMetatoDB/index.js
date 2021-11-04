/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */


const { CosmosClient } = require("@azure/cosmos");

const endpoint = "https://rgfreshtrackscosmosdb.documents.azure.com:443/";
const key = "ajToBjXzj6mUXARpdzfMCO2rrncYYqPuYmt7cfivdjm4mzUnGfl8jXllmdDae3qpm8hHQn86xXnFulo8UN6kLA==";
const client = new CosmosClient({ endpoint, key });
const dbName = 'FreshTracksGpx';
const containerName = 'GpxItems';

const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

module.exports = async function (context,req) {
    try {
var Item =  {
      ID: Math.floor(Math.random() * Math.floor(10000000)).toString(),
      gpxFile: context.bindingData.data.body.gpxFile, 
      created: Math.floor(Date.now() / 1000),
      metadata:JSON.stringify({gpxMeta : context.bindingData.data.body.gpxMeta}),
      key:'1',
      //user_id:context.bindings.requestParameters['x-amz-meta-user-id']
    
  }
 
    const dbResponse = await client.databases.createIfNotExists({
        id: dbName
      });
     
      const coResponse = await dbResponse.database.containers.createIfNotExists({
        id: containerName
      });
      
      coResponse.container.items.create(Item)
     
  }
  catch (err) {
      console.log(err)
      //metrics.putMetric("ErrorDBRecord", 1, "Count");
      return err
  }
  return {
        statusCode: 200,
        body: 'OK!',
        headers,
    }
};