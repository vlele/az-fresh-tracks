const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const storage = require("@azure/storage-blob");
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      }

    try {        
        const endpoint = process.env.FreshTracks_CosmosAccount_Endpoint;
        const key = process.env.FreshTracks_CosmosAccount_Key;
        const dbName = process.env.FreshTracks_CosmosAccount_DBName;
        const containerName = process.env.FreshTracks_CosmosAccount_ContainerName;
        const dbClient = new CosmosClient({ endpoint, key });
        const accountname = process.env.FreshTracks_StorageAccount;
        const containerName = process.env.FreshTracks_FileUploadContainer;
        const blobkey = process.env.FreshTracks_StorageAccount_Key;
        const creds = new storage.StorageSharedKeyCredential(accountname,blobkey);
        const blobServiceClient = new storage.BlobServiceClient(`https://${accountname}.blob.core.windows.net`,creds);
        const client =blobServiceClient.getContainerClient(containerName)
        
        const id = context.bindingData.query.iD;
        const database = dbClient.database(dbName);
        const container = database.container(dbContainerName);
        
        const querySpec = {
            query: `SELECT * from c where c.id= "${id}"`
        };
              
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();
      
      const blobClient = client.getBlobClient(items[0].key);
      const downloadBlockBlobResponse = await blobClient.download(0);
      console.log('\nDownloaded blob content...');

      let gpx  = await streamToString(downloadBlockBlobResponse.readableStreamBody);
       context.res = {
            statusCode: 200,
            body: gpx,
            headers
        }
    }

    catch (err) {
          console.error(err)
    }
}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
}