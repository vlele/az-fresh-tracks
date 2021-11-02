﻿/*
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

    context.log("Input Received From HttpTrigger Functionn...", context.bindingData.input);

    // Replace "Hello" with the name of your Durable Activity Function.
    outputs.push(yield context.df.callActivity("ProcessGPXFIle", context.bindingData.input));
    outputs.push(yield context.df.callActivity("SaveMetatoDB", "previousInput"));
    outputs.push(yield context.df.callActivity("PublishtoIOT", "PreviousInput"));

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return outputs;
});