var ColdStart = true;
module.exports = async function (context, req) {
  //ToDo: metric scope is not migrated from aws-azure functions yet.
  try{
    //Copied code
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
    //var ColdStart = true;
    appInsights.setup(iKey).start();
    if (ColdStart){
      appInsights.defaultClient.trackMetric({name: "coldstart", value: 1})
      ColdStart = false;
    } else {
      appInsights.defaultClient.trackMetric({name: "warmstart", value: 1})
    }

    ////Using Emulator
    //const accountname = 'devstoreaccount1'local storage emulator accouont name substitute.
    //const key = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="; //local emulator key.
    ////End of config to use emulator.

    const cerds = new storage.StorageSharedKeyCredential(accountname,key);
    const blobServiceClient = new storage.BlobServiceClient(`https://${accountname}.blob.core.windows.net`,cerds);
    const client =blobServiceClient.getContainerClient(containerName)
    const blobName=  context.req.body.filePath; //can be hard-coded while debugging locally.
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
    //
    const sasUrl= blobClient.url+"?"+blobSAS;
    console.log(sasUrl);

    context.res = {
      // status: 200, /* Defaults to 200 */
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