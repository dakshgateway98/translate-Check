const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5555;
const translate = require('@k3rn31p4nic/google-translate-api');
app.use(cors());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(express.static("client/build"));
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
app.post("/tran",(req,response) =>  {
  //  console.log("Hello",req.body)
    translate(req.body.line, {from: 'gu', to: 'en'}).then(res => {
        console.log(res.text);
        //=> I speak English
        return response.status(200).send(res.text)
       // console.log(res.from.language.iso);
        //=> nl
    }).catch(err => {
        console.error(err);
        return response.status(500).send(err)
    });
});
//visit localhost:3000
// assuming you have done 1) npm init 2) npm install express
