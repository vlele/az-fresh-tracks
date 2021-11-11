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

const endpoint = process.env.FreshTracks_CosmosAccount_Endpoint;
const key = process.env.FreshTracks_CosmosAccount_Key;
const dbName = process.env.FreshTracks_CosmosAccount_DBName;
const containerName = process.env.FreshTracks_CosmosAccount_ContainerName;
var ColdStart = true;
const headers = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

module.exports = async function (context,req) {

    var appInsights = require('applicationinsights');
    const iKey = process.env.FreshTracks_AppInsights_Ikey;
    appInsights.setup(iKey).start();
    if (ColdStart){
      appInsights.defaultClient.trackMetric({name: "coldstart", value: 1})
      ColdStart = false;
    } else {
      appInsights.defaultClient.trackMetric({name: "warmstart", value: 1})
    }

    try {
    var Item =  {
        id: Math.floor(Math.random() * Math.floor(10000000)).toString(),
        gpxFile: context.bindingData.data.body.gpxFile, 
        created: Math.floor(Date.now() / 1000),
        metadata:JSON.stringify({gpxMeta : context.bindingData.data.body.gpxMeta}),   
        key: context.bindingData.data.body.blobName,
        user_id:context.bindingData.data.body.userID
    }
    const client = new CosmosClient({ endpoint, key });
    const dbResponse = await client.databases.createIfNotExists({
            id: dbName
        });
        
    const coResponse = await dbResponse.database.containers.createIfNotExists({
            id: containerName
        });
        
    coResponse.container.items.create(Item);
     
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