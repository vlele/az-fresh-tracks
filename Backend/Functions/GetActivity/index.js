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
        const endpoint = "https://rgfreshtrackscosmosdb.documents.azure.com:443/";
        const key = "ajToBjXzj6mUXARpdzfMCO2rrncYYqPuYmt7cfivdjm4mzUnGfl8jXllmdDae3qpm8hHQn86xXnFulo8UN6kLA==";
        const dbName = 'FreshTracksGpx';
        const dbContainerName = 'GpxItems';
        const dbClient = new CosmosClient({ endpoint, key });
        const accountname ="storagefreshtracks";
        const containerName = "freshtracks";
        const blobkey = "DwVLDqHw2T6fVIE0swFJtCrCQXLIGiD5BBIQWNa4m/epmDw/ZZqtvgmG0KqQpMK7ybk+WPetFlW4F5kVNsrPag=="
        const creds = new storage.StorageSharedKeyCredential(accountname,blobkey);
        const blobServiceClient = new storage.BlobServiceClient(`https://${accountname}.blob.core.windows.net`,creds);
        const client =blobServiceClient.getContainerClient(containerName)
        
        const id = context.bindingData.query.id;
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
         return  response = {
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