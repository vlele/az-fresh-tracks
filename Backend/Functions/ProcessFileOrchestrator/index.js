/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const outputs = [];
//const sample =  {topic: '/subscriptions/0d4f44f5-e032-49de-ba6c-86dcf4201a31/resourceGroups/rg_fresh_tracks/providers/Microsoft.Storage/storageAccounts/storagefreshtracks',subject: '/blobServices/default/containers/freshtracks/blobs/activity-1.gpx',eventType: 'Microsoft.Storage.BlobCreated',id: 'bb861abb-701e-0082-049a-cfe9490677b4',data: {api: 'PutBlockList',clientRequestId: 'c7e38588-efdf-4a3a-bd4d-f7c6c74081b1',requestId: 'bb861abb-701e-0082-049a-cfe949000000',eTag: '0x8D99DB1ACBB4492',contentType: 'application/octet-stream',contentLength: 314330,blobType: 'BlockBlob',url: 'https://storagefreshtracks.blob.core.windows.net/freshtracks/activity-1.gpx',sequencer: '00000000000000000000000000000EA10000000000bb9701',storageDiagnostics: { batchId: '8c2abbc4-3006-003a-009a-cfb28f000000' }},dataVersion: '',metadataVersion: '1',eventTime: '2021-11-02T03:34:28.2371995Z'}
    context.log("Input Received From HttpTrigger Functionn...", context.bindingData.input);
 //context.bindingData.input = sample;

    var parsedGPX = yield context.df.callActivity("ProcessGPXFIle", context.bindingData.input);
    var savedMeta = yield context.df.callActivity("SaveMetatoDB", parsedGPX);
    outputs.push(yield context.df.callActivity("PublishtoIOT", "PreviousInput"));

    return outputs;
});