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

// sample blob info

// {topic: '/subscriptions/ea721dce-f4b1-4b2d-a802-65b2360e1bd6/resourceGroups/Praneeth_RG/providers/Microsoft.Storage/storageAccounts/testtracks',
// subject: '/blobServices/default/containers/files/blobs/PAra-icone-Zendesk.png',
// eventType: 'Microsoft.Storage.BlobCreated',
// id: '94b0bf44-a01e-0003-4318-ce44c10617f8',
// data: {api: 'PutBlob',clientRequestId: '155f0a9d-99ac-467d-b348-c4f50dde2010',
// requestId: '94b0bf44-a01e-0003-4318-ce44c1000000',eTag: '0x8D99C2FD3A7F4AA',
// contentType: 'image/png',contentLength: 22560,
// blobType: 'BlockBlob',url: 'https://testtracks.blob.core.windows.net/files/PAra-icone-Zendesk.png',
// sequencer: '00000000000000000000000000006410000000000015a22c',
// storageDiagnostics: { batchId: '2e3f4e2e-c006-002a-0018-ce7ab5000000' }},dataVersion: '',metadataVersion: '1',eventTime: '2021-10-31T05:32:27.8041527Z'}

var GPX = require("gpx-parse");
const axios = require('axios');
var storage = require("@azure/storage-blob")
const url = require('url');;
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  }

module.exports = async function (context) {
  context.log("blobinfo", context.bindings.blobinfo);
  try {
  var blobSASPermission = new storage.BlobSASPermissions();
  blobSASPermission.write = true;
  blobSASPermission.create = true;
  blobSASPermission.add = true;
  blobSASPermission.expiry
  const accountname ="storagefreshtracks";
  const containerName = "freshtracks";
  const key = "DwVLDqHw2T6fVIE0swFJtCrCQXLIGiD5BBIQWNa4m/epmDw/ZZqtvgmG0KqQpMK7ybk+WPetFlW4F5kVNsrPag=="
  const creds = new storage.StorageSharedKeyCredential(accountname,key);
  const blobServiceClient = new storage.BlobServiceClient(`https://${accountname}.blob.core.windows.net`,creds);
  const client =blobServiceClient.getContainerClient(containerName)
  const blobName=url.parse(context.bindings.blobinfo.data.url,false).pathname.split('/').pop();
  const blobClient = client.getBlobClient(blobName);
 
const downloadBlockBlobResponse = await blobClient.download(0);
console.log('\nDownloaded blob content...');
let gpx  = await streamToString(downloadBlockBlobResponse.readableStreamBody);
let gpxMeta={'name':'FreshTracks-'+Date.now(),'length':0,'time':new Date()}
GPX.parseGpx(gpx, function(error, data) {

    if(typeof data !== 'undefined'){
        //likely no version data
        gpxMeta={'name':data.tracks[0].name,'length':data.tracks[0].length(),'time':data.metadata.time}
    }
    //metrics.setProperty("GPXMetadata", gpxMeta);
    //metrics.putMetric("TracksUploaded", 1, "Count");
    });

    return {
        statusCode: 200,
        body:{gpxMeta:gpxMeta,gpxFile: context.bindings.blobinfo.data.url} ,
        headers,
    }
  } catch (err) {
    console.error(err)
  }
};

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