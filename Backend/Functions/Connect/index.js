module.exports = async function (context, req, connectionInfo) {
    context.res = { body: connectionInfo }
    context.done()
     //"userId": "{headers.x-ms-client-principal-id}"
}