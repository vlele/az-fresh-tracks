<template>
  <div></div>
</template>

<script>
import configService from "../auth/configService";
import axios from "axios";
import signalR from "@microsoft/signalr";
export default {
  name: "signalRClient",
  methods: {
    async ConnectToHub() {
     

    const clientId =
      "UpdateTable-" +
      this.$auth.user.sub +
      "-" +
      Math.floor(Math.random() * 100000000 + 1);
      let connectionUrl = "";
      let accessToken = "";
      const token = await this.$auth.getTokenSilently();
      console.log("Token:" + token);
      axios({
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        url: configService.getConfigs().VUE_APP_APIGW_URL + "/Connect?userId="+this.$auth.user.sub,
        params: { user_id: this.user_id },
      }).then(({ data }) => {
        connectionUrl = data.url;
        accessToken = data.accessToken;
        this.getUpdates(connectionUrl, accessToken);
      });
    },

    getUpdates(connectionUrl, accessToken) {
      const signalR = require("@microsoft/signalr");
       const currentlySubscribedTopic = "fileUpload-" + this.$auth.user.sub;
    //console.log("subscribedto" + "-" + currentlySubscribedTopic);
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(connectionUrl, { accessTokenFactory: () => accessToken })
        //.configureLogging(signalR.LogLevel.Trace)
        .withAutomaticReconnect()
        .build();

      connection.onclose(() => {
        console.log("SignalR connection disconnected");
        setTimeout(() => this.ConnectToHub(), 2000);
      });

      connection.on("fileUpload", (updated) => {
        console.log("Received message...", updated);
        this.$root.$emit("send", "updated");
      });

      connection
        .start()
        .then(() => {
          console.log("SignalR connection established");
        })
        .catch(console.error);
    },
  },
  created() {
    const signalR = require("@microsoft/signalr");

    //{headers.x-ms-client-principal-id}
    console.log("IoT component created");
    let that = this;
   this.ConnectToHub();
    // LOOK! YOU WILL NEED TO UPDATE THESE VALUES!
    
    
  },
};
</script>
