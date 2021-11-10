const axios = require('axios');

var ColdStart = true;

module.exports = async function (context, eventGridEvent) {
    var appInsights = require('applicationinsights');

    const iKey = process.env.FreshTracks_AppInsights_Ikey;
    appInsights.setup(iKey).start();
    if (ColdStart){
      appInsights.defaultClient.trackMetric({name: "coldstart", value: 1})
      ColdStart = false;
    } else {
      appInsights.defaultClient.trackMetric({name: "warmstart", value: 1})
    }
    
    const url =`${process.env.FunctionAppUrl}/orchestrators/ProcessFileOrchestrator`; 

    axios
        .post(url, eventGridEvent)
        .then(res => {
            console.log(`statusCode: ${res.status}`)
        })
        .catch(error => {
            console.error(error)
        })
};