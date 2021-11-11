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
var ColdStart = true;
module.exports = df.orchestrator(function* (context) {
    
    var appInsights = require('applicationinsights');
    const iKey = process.env.FreshTracks_AppInsights_Ikey;
    appInsights.setup(iKey).start();
    if (ColdStart){
      appInsights.defaultClient.trackMetric({name: "coldstart", value: 1})
      ColdStart = false;
    } else {
      appInsights.defaultClient.trackMetric({name: "warmstart", value: 1})
    }
    var parsedGPX =yield context.df.callActivity("ProcessGPXFIle", context.bindingData.input);
    var savedMeta = yield context.df.callActivity("SaveMetatoDB", parsedGPX);
     var IotResult = yield  context.df.callActivity("PublishtoIOT", parsedGPX.body.userID);

    
});