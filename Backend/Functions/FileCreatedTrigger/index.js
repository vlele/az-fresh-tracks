const axios = require('axios');

module.exports = async function (context, eventGridEvent) {
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);
    context.log('My Trigger is called...');

    const url = 'https://fresh-tracks-backend.azurewebsites.net/api/orchestrators/ProcessFileOrchestrator';

    axios
        .post(url, eventGridEvent)
        .then(res => {
            context.log('My Trigger API Response...');
            context.log(res);
            console.log(`statusCode: ${res.status}`)
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })
};