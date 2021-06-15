// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
require("dotenv").config();
const express = require("express");
const axios = require("axios");
//for current date in india
const moment = require("moment");
const date = moment().utcOffset("+05:30").format("DD-MM-YYYY");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const app = express();

let slots = [];

let message = "Slots Available:\n";

let sent = false;

app.get("", (req, res) => {
  res.send("working");
});

app.listen("3000", () => {
  console.log("app running on port 3000");
});
function getSlot() {
  sent = false;
  axios
    .get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=391&date=${date}`
    )
    .then((response) => {
      // handle success
      if (response.data.length !== 0) {
        slots = response.data.sessions;
        slots.map((items) => {
          if (items.block_name === "Jaoli" && items.available_capacity !== 0) {
            sent = true;
            message =
              message +
              `${items.name} ${items.min_age_limit} ${items.vaccine} ▶${items.available_capacity} \n`;
          }
        });
      }
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
setInterval(() => {
  console.log("running successfully");
  getSlot();
  if (sent) {
    client.messages
      .create({
        body: `${message}`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+917356246625",
      })
      .then(() => console.log("message sent"))
      .done();
  }
}, 4000);
