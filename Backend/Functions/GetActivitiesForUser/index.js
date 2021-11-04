const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      }
    const endpoint = "https://rgfreshtrackscosmosdb.documents.azure.com:443/";
    const key = "ajToBjXzj6mUXARpdzfMCO2rrncYYqPuYmt7cfivdjm4mzUnGfl8jXllmdDae3qpm8hHQn86xXnFulo8UN6kLA==";
    const dbName = 'FreshTracksGpx';
    const containerName = 'GpxItems';
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

        return {
            statusCode: 200,
            body: JSON.stringify(items),
            headers,
            }
        }
      catch (err) {
        console.log(err);
        //metrics.putMetric("ErrorDBRecord", 1, "Count");
        return err;
    }
}