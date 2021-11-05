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

module.exports = async function (context) {
    context.bindings.signalRMessages = "Test Message";
//Endpoint=https://tracksignal.service.signalr.net;AccessKey=uTZ2ns7G2pW1RI9YIhr37uSr8C9xoJmveW1+PkSQiLo=;Version=1.0;

context.bindings.signalRMessages = {target: 'statusUpdates',
arguments: ["test1","test2","test3"]};

    context.done();
    return `Hello ${context.bindings.name}!`;
};