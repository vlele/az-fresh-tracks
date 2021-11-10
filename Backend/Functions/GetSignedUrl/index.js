var ColdStart = true;
module.exports = async function (context, req) {
  try{
    var storage = require("@azure/storage-blob")
    var appInsights = require('applicationinsights');
    var blobSASPermission = new storage.BlobSASPermissions();
    blobSASPermission.write = true;
    blobSASPermission.create = true;
    blobSASPermission.add = true;
    blobSASPermission.expiry
    const accountname = process.env.FreshTracks_StorageAccount;
    const containerName = process.env.FreshTracks_FileUploadContainer;
    const key = process.env.FreshTracks_StorageAccount_Key;
    const iKey = process.env.FreshTracks_AppInsights_Ikey;
    appInsights.setup(iKey).start();
    if (ColdStart){
      appInsights.defaultClient.trackMetric({name: "coldstart", value: 1})
      ColdStart = false;
    } else {
      appInsights.defaultClient.trackMetric({name: "warmstart", value: 1})
    }

    const cerds = new storage.StorageSharedKeyCredential(accountname,key);
    const blobServiceClient = new storage.BlobServiceClient(`https://${accountname}.blob.core.windows.net`,cerds);
    const client =blobServiceClient.getContainerClient(containerName)
    const blobName=  context.req.body.filePath;
    const blobClient = client.getBlobClient(blobName);

    const blobSAS = storage.generateBlobSASQueryParameters({
      containerName, 
      blobName, 
      permissions: blobSASPermission, 
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 36000)
    },
    cerds 
    ).toString();
    const sasUrl= blobClient.url+"?"+blobSAS;
    console.log(sasUrl);

    context.res = {
      body: sasUrl
    };

  }catch(err){
    context.log(err);
      context.res = {
        status: 400,
        body: err.message
      }
    }

  context.log('JavaScript HTTP trigger function processed a request.');
}