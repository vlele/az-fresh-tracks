<template>
  <div></div>
</template>

<script>
import {
  VUE_APP_AWSRegion,
  VUE_APP_IdentityPoolId,
  VUE_APP_AwsIoTEndpoint,
} from "../auth/auth_config.json";
import configService from "../auth/configService";
import axios from "axios";
export default {
  name: "IoT",
  created() {
    const signalR = require("@microsoft/signalr");

    //{headers.x-ms-client-principal-id}
    console.log("IoT component created");
    let that = this;

    // LOOK! YOU WILL NEED TO UPDATE THESE VALUES!
    const currentlySubscribedTopic = "UpdateTable-" + this.$auth.user.sub;
    console.log("subscribedto" + "-" + currentlySubscribedTopic);

    const clientId =
      "UpdateTable-" +
      this.$auth.user.sub +
      "-" +
      Math.floor(Math.random() * 100000000 + 1);

    const getUpdates = (connectionUrl, accessToken) => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(connectionUrl, { accessTokenFactory: () => accessToken })
        .configureLogging(signalR.LogLevel.Trace)
        .withAutomaticReconnect()
        .build();

      connection.onclose(() => {
        console.log("SignalR connection disconnected");
        setTimeout(() => connect(), 2000);
      });

      connection.on("fileprocess", (updated) => {
        console.log("Received message...", updated);
        that.$root.$emit("send", "updated");
      });

      connection
        .start()
        .then(() => {
          console.log("SignalR connection established");
        })
        .catch(console.error);
    };
    const connect = () => {
      let connectionUrl = "";
      let accessToken = "";
      axios({
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        url: configService.getConfigs().VUE_APP_APIGW_URL + "/Connect", //?userId='+clientId
        params: { user_id: this.user_id },
      }).then(({ data }) => {
        connectionUrl = data.url;
        accessToken = data.accessToken;
        getUpdates(connectionUrl, accessToken);
      });
    };
    connect();
  },
};
</script>
