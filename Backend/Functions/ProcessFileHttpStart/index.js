const df = require("durable-functions");
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

    const client = df.getClient(context);
    const instanceId = await client.startNew(req.params.functionName, undefined, req.body);
    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};