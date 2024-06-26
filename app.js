/* Mailer coded by Angela Lopez Mendoza (angelahack1) */
/* Last modification date: Nov/2023 */

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_AIXKARE_GRAPHQLAPIIDOUTPUT
	API_AIXKARE_GRAPHQLAPIENDPOINTOUTPUT
	API_AIXKARE_GRAPHQLAPIKEYOUTPUT
	production
Amplify Params - DO NOT EDIT */
const aws = require('aws-sdk');
const nodemailer = require('nodemailer');
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const fs = require('fs');
var credArray = [];
var callbackArray = [];
var objCallback = null;

aws.config.update({region: 'us-east-1'});

try {
  const data = fs.readFileSync('./credentials.dat', 'utf8');
  credArray = data.split(',');
} catch (err) {
  credArray = null;
  const currentDate = new Date();
  console.error("ERROR at Startup (loading creds) ...AixKare Mailer App v"+"03062024_1312"+" is being stopped, at: ", currentDate, ".");
  process.exit(-1);
}

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
    accessKeyId: credArray[0],
    accessSecretKey: credArray[1],
    region: "us-east-1"
    }), 
    sendingRate: 1
});
 
const app = express();
app.use(awsServerlessExpressMiddleware.eventContext());
app.use( cors({ origin: "*", methods: "GET, POST, OPTIONS", headers: "Accept, Content-Type" }) );
app.use(bodyParser.json());

app.get('/*', function(req, res) {
  const currentDate = new Date();
  if(req.method == 'OPTIONS') {
    console.log('Received an OPTIONS at GET, request on ', req.url, ' at: ', currentDate);
    res.sendStatus(200);
  } else if(req.method == 'GET') {
    console.log(">>>>>>>>>>>>Request(GET): {");
    console.log(req);
    console.log(">>>>>>>>>>>>QueryString(GET): {");
    console.log(req.query);
    console.log("}>>>>>>>>>>>>");
    const email = req.query.email;
    const comment = req.query.comment;
    const lang = req.query.lang;
    var from = req.query.from;
    var bodyMail = "";
    var mailOptions = {};
    var ok = true;

    if(typeof email != 'undefined' && email != null ) {
      if(from.indexOf("aixkare") > -1) {
        bodyMail = 'We have received a comment!!, from: '+email+'\n'+'Commentary: '+comment+'\n';
        mailOptions = {
          from: 'mailer@aixkare.com',
          to: 'angela.l.m@aixkare.com',
          subject: 'Comment from AixKare from AixKare-Mailer',
          text: bodyMail
        };
      } else if(from.indexOf("artecnologia") > -1) {
        bodyMail = 'Hemos recibido un comentario!!, de: '+email+'\n'+'Comentario: '+comment+'\n';
        mailOptions = {
          from: 'mailer@artecnologia.aixkare.com',
          to: 'angela.l.m@aixkare.com',
          subject: 'Comment from Artecnologia by AixKare-Mailer',
          text: bodyMail
        };
      } else if(from.indexOf("ayaspa") > -1) {
        bodyMail = 'Hemos recibido un comentario!!, de: '+email+'\n'+'Comentario: '+comment+'\n';
        mailOptions = {
          from: 'mailer@ayaspa.aixkare.com',
          to: 'angela.l.m@aixkare.com',
          subject: 'Comment from A&A Spa by AixKare-Mailer',
          text: bodyMail
        };
      } else {
      console.log('WARNING from indicator not present, Mail did not tried to be sent');
      res.sendStatus(200);
      return;
    }

      var CallbackObject = function() {
        this.from = mailOptions.from;
        this.to = mailOptions.to;
        this.subject = mailOptions.subject;
        this.text = mailOptions.txt;
        this.lang = lang;

        this.callback = function(err, info) {
          console.log("CallbackObject::callback()...");
          if(err) {
            console.log("Error at event called-back: ");
            console.error(err);
          } 
          if(info) {
            console.log("Info at event called-back: ");
            console.info(info);
          }
          console.log("...CallbackObject::callback()");
        };
      };

      var callbackObjectInstance = new CallbackObject();
      transporter.sendMail(mailOptions, function(err, info) { callbackObjectInstance.callback(err, info); } );

      if(from.indexOf("artecnologia") > -1) {
        console.log('GET /* On Artecnología, Message queued to sent successfully!: <'+email+'><'+comment+'>');
        if(lang == 'en') {
          res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
        } else if(lang == 'es') {
          res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=es");
        } else if(lang == 'pt') {
          res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=pt");
        } else{
          res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
        }
      } else if(from.indexOf("aixkare") > -1) {
        console.log('GET /* On AiXKare, Message queued to sent successfully!: <'+email+'><'+comment+'>');
        if(lang == 'en') {
          res.redirect("https://www.aixkare.com/thanks.html?lang=en");
        } else if(lang == 'es') {
          res.redirect("https://www.aixkare.com/thanks.html?lang=es");
        } else if(lang == 'pt') {
          res.redirect("https://www.aixkare.com/thanks.html?lang=pt");
        } else{
          res.redirect("https://www.aixkare.com/thanks.html?lang=en");
        }
      } else if(from.indexOf("ayaspa") > -1) {
        console.log('GET /* On A&A Spa, Message queued to sent successfully!: <'+email+'><'+comment+'>');
        res.redirect("https://ayaspa.aixkare.com/gracias.html");
      } else {
        console.log('ERROR Message queued but from is incorrect...!: <'+email+'><'+comment+'>');
        res.redirect("https://www.aixkare.com/index.html");
      }
    } else {
      console.log('WARNING Mail from Message not present in method GET, Mail did not tried to be sent');
      res.sendStatus(200);
    }
  }
});

app.post('/*', function(req, res) {
  const currentDate = new Date();
  if(req.method == 'OPTIONS') {
    console.log('Received an OPTIONS at POST, request on ', req.url, ' at: ', currentDate);
    res.sendStatus(200);
    return;
  } else if(req.method == 'POST') {
    console.log(">>>>>>>>>>>>Request (POST): {");
    console.log(req);
    console.log("}>>>>>>>>>>>>");
    const email = req.body.email;
    const comment = req.body.comment;
    const lang = req.body.lang;
    var from = req.body.from;
    var bodyMail = "";
    var mailOptions = {};
    var ok = true;
    if(typeof email != 'undefined' && email != null ) {
      if(from.indexOf("aixkare") > -1) {
        aixkare= true;
        bodyMail = 'We have received a comment!!, from: '+email+'\n'+'Commentary: '+comment+'\n';
        mailOptions = {
          from: 'mailer@aixkare.com',
          to: 'angela.l.m@aixkare.com',
          subject: 'Comment from AixKare from AiXKare-Mailer',
          text: bodyMail
        };
    } else if(from.indexOf("artecnologia") > -1) {
      bodyMail = 'Hemos recibido un comentario!!, de: '+email+'\n'+'Comentario: '+comment+'\n';
      mailOptions = {
        from: 'mailer@artecnologia.aixkare.com',
        to: 'angela.l.m@aixkare.com',
        subject: 'Comment from Artecnologia by AiXKare-Mailer',
        text: bodyMail
      };
    } else if(from.indexOf("ayaspa") > -1) {
      bodyMail = 'Hemos recibido un comentario!!, de: '+email+'\n'+'Comentario: '+comment+'\n';
      mailOptions = {
        from: 'mailer@ayaspa.aixkare.com',
        to: 'angela.l.m@aixkare.com',
        subject: 'Comment from A&A Spa by AiXKare-Mailer',
        text: bodyMail
      };
    } else {
      console.log('WARNING from indicator not present, Mail did not tried to be sent');
      res.sendStatus(200);
      return;
    }

    var CallbackObject = function() {
      this.from = mailOptions.from;
      this.to = mailOptions.to;
      this.subject = mailOptions.subject;
      this.text = mailOptions.txt;
      this.lang = lang;

      this.callback = function(err, info) {
        console.log("CallbackObject::callback()...");
        if(err) {
          console.log("Error at event called-back: ");
          console.error(err);
        } 
        if(info) {
          console.log("Info at event called-back: ");
          console.info(info);
        }
        console.log("...CallbackObject::callback()");
      };
    };

    var callbackObjectInstance = new CallbackObject();
    transporter.sendMail(mailOptions, function(err, info) { callbackObjectInstance.callback(err, info); } );

        if(from.indexOf("artecnologia") > -1) {
          console.log('OK POST /* Artecnologia, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          if(lang == 'en') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=pt");
          } else{
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
          }
        } else if(from.indexOf("aixkare") > -1) {
          console.log('OK POST /* AiXKare, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          if(lang == 'en') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=pt");
          } else{
            res.redirect("https://www.aixkare.com/thanks.html?lang=en");
          }
        } else if(from.indexOf("ayaspa") > -1) {
          console.log('OK POST /* A&A Spa, Message queued to sent successfully!: <'+email+'><'+comment+'>');
            res.redirect("https://ayaspa.aixkare.com/gracias.html");
        } else {
          console.log('ERROR Message queued but from is incorrect...!');
          console.log('ERROR post /* call succeed, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          res.redirect("https://www.aixkare.com/thanks.html?lang=en");
        }
    } else {
      console.log('WARNING Mail from Message not present in method POST, Mail did not tried to be sent');
      res.sendStatus(200);
    }
  }
});

process.on('exit', () => {
  const currentDate = new Date();
  console.log("...AixKare Mailer App v"+"03062024_1312"+" is being stopped, at: ", currentDate, ".");
 });

app.listen(3000, function() {
    const currentDate = new Date();
    console.log("AixKare Mailer App v"+"03062024_1312"+" started, at: ", currentDate, "...");
});

module.exports = app
