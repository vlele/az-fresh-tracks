const { CosmosClient } = require("@azure/cosmos");

var ColdStart = true;
module.exports = async function (context, req) {
  var appInsights = require('applicationinsights');


  const iKey = process.env.FreshTracks_AppInsights_Ikey;
    appInsights.setup(iKey).start();
    if (ColdStart){
      appInsights.defaultClient.trackMetric({name: "coldstart", value: 1})
      ColdStart = false;
    } else {
      appInsights.defaultClient.trackMetric({name: "warmstart", value: 1})
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      }
      const endpoint = process.env.FreshTracks_CosmosAccount_Endpoint;
      const key = process.env.FreshTracks_CosmosAccount_Key;
      const dbName = process.env.FreshTracks_CosmosAccount_DBName;
      const containerName = process.env.FreshTracks_CosmosAccount_ContainerName;
      const client = new CosmosClient({ endpoint, key });
      try{
               
        const userID = context.bindingData.query.user_id;
      
        const database = client.database(dbName);
        const container = database.container(containerName);

        const querySpec = {
           query: `SELECT * from c where c.user_id= "${userID}"`          
        };
        
        // read all items in the Items container
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();

       context.res={
            statusCode: 200,
            body:{Items:items},
            headers,
            }
        }
      catch (err) {
        console.log(err);
        //metrics.putMetric("ErrorDBRecord", 1, "Count");
        return err;
    }
}