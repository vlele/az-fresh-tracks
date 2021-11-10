const axios = require('axios');

module.exports = async function (context, eventGridEvent) {

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