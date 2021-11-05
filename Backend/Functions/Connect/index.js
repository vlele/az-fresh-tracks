module.exports = async function (context, req, connectionInfo) {
    context.log('JavaScript HTTP trigger function processed a request.');
    //"userId": "{headers.x-ms-client-principal-id}",
    context.res = { body: connectionInfo }
    context.done()
}