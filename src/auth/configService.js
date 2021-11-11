import { domain,clientId,audience, VUE_APP_APIGW_URL } from "./auth_config.json";
export default {
getConfigs(){
    return {
        domain:domain,
        clientId:clientId,
        audience:audience, 
        VUE_APP_APIGW_URL:VUE_APP_APIGW_URL
    }
}
}