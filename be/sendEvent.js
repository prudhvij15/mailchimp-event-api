const md5 = require("md5");
const moment = require("moment");
const sendEvent = async (req, res) => {
  const { email, name, properties, listID } = req.body;
  const iso = moment().format("YYYY-MM-DDTHH:mm:ssZ");
  console.log(iso);
  const date = new Date();
  const hashedMail = md5(email);
  console.log("Received Data:", { email, name, properties, listID });
  const apiKey = process.env.API_KEY;
  const audienceId = listID;
  const url = `https://us10.api.mailchimp.com/3.0/lists/${audienceId}/members/${hashedMail}/events`;

  console.log(iso);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`apikey:${apiKey}`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({
        email_address: email,
        name: name,
        properties: properties,
        occured_at: iso,
      }),
    });

    if (response.status === 204) {
      console.log("Success: No content");
      res.json({ success: true });
    } else {
      const responseBody = await response.text();
      try {
        const responseData = JSON.parse(responseBody);
        console.log("Success with data:", responseData);
        res.json(responseData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res
          .status(500)
          .json({ error: "Error parsing JSON from Mailchimp API" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = sendEvent;
