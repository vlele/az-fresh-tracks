<template>
  <div></div>
</template>

<script>
import { VUE_APP_AWSRegion, VUE_APP_IdentityPoolId, VUE_APP_AwsIoTEndpoint } from "../auth/auth_config.json";
import configService from '../auth/configService'
export default {
  name: 'IoT',
  created () {
    const AWS = require('aws-sdk')
    const AWSIoTData = require('aws-iot-device-sdk')
    

    
    console.log('IoT component created')
    let that = this

    // LOOK! YOU WILL NEED TO UPDATE THESE VALUES!
    const currentlySubscribedTopic = 'UpdateTable-'+this.$auth.user.sub
    console.log('subscribedto'+'-'+currentlySubscribedTopic)

    const AWSConfiguration = {
      poolId: VUE_APP_IdentityPoolId, // 'YourCognitoIdentityPoolId'
      host: VUE_APP_AwsIoTEndpoint, // 'YourAwsIoTEndpoint', e.g. 'prefix.iot.us-east-1.amazonaws.com'
      region: VUE_APP_AWSRegion // 'YourAwsRegion', e.g. 'us-east-1'
    }

    const clientId = 'UpdateTable-'+this.$auth.user.sub+'-' + (Math.floor((Math.random() * 100000000) + 1))
    AWS.config.region = AWSConfiguration.region

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSConfiguration.poolId
    })

    const mqttClient = AWSIoTData.device({
      region: AWS.config.region,
      host: AWSConfiguration.host,
      clientId: clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 8000,
      debug: false,
      accessKeyId: '',
      secretKey: '',
      sessionToken: ''
    })

    const cognitoIdentity = new AWS.CognitoIdentity()
    const getCreds = () => {
      AWS.config.credentials.get((err, data) => {
        if (!err) {
         // console.log('retrieved identity: ' + AWS.config.credentials.identityId)
          const params = {
            IdentityId: AWS.config.credentials.identityId
          }
          cognitoIdentity.getCredentialsForIdentity(params, (err, data) => {
           // console.log('CREDS:', data)
            if (!err) {
              mqttClient.updateWebSocketCredentials(data.Credentials.AccessKeyId,
                data.Credentials.SecretKey,
                data.Credentials.SessionToken)
            } else {
             // console.log('error retrieving credentials: ' + err)
            }
          })
        } else {
          //console.log('error retrieving identity:' + err)
        }
      })
    }

    mqttClient.on('connect', () => {
      console.log('mqttClient connected')
      mqttClient.subscribe(currentlySubscribedTopic)
    })

    mqttClient.on('error', (err) => {
      //console.log('mqttClient error:', err)
      getCreds()
    })

    mqttClient.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString())
      console.log('mqttClient message: ', msg)
      // Send the message back to parent component
      that.$root.$emit('send', msg)
    })

//     const connect = () => {
//     const connection = new signalR.HubConnectionBuilder()
//                             .withUrl(`${configService.getConfigs().VUE_APP_APIGW_URL}/api`)
//                             .build();

//     connection.onclose(()  => {
//         console.log('SignalR connection disconnected');
//         setTimeout(() => connect(), 2000);
//     });

//     connection.on('updated', updatedStock => {
//          that.$root.$emit('send', "updated")
//     });

//     connection.start().then(() => {
//         console.log("SignalR connection established");
//     });
// };

//connect();
  }
}
</script>
