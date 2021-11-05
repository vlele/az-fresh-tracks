module.exports = async function (context, req, connectionInfo) {
    context.res.body = connectionInfo;
    //"userId": "{headers.x-ms-client-principal-id}",
};