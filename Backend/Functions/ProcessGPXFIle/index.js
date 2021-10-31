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



module.exports = async function (context) {
    context.log("blobinfo", context.bindings.blobinfo);
    //need to process gpx file here
    return `Hello ${context.bindings.blobinfo}!`;
};