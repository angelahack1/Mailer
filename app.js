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

aws.config.update({region: 'us-east-1'});

try {
  const data = fs.readFileSync('./credentials.dat', 'utf8');
  credArray = data.split(',');
} catch (err) {
  credArray = null;
  const currentDate = new Date();
  console.error("ERROR at Startup (loading creds) ...AixKare Mailer App v"+"10122023_1629"+" is being stopped, at: ", currentDate, ".");
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
    console.log(req.query);
    console.log("}>>>>>>>>>>>>");
    const email = req.query.email;
    const comment = req.query.comment;
    const lang = req.query.lang;
    var bodyMail = "";
    var mailOptions = {};
    var ok = true;
    var aixkare = false;
    if(typeof email != 'undefined' && email != null ) {
      if(req.url.indexOf("aixkare") > -1) {
        aixkare = true;
        bodyMail = 'We have received a comment!!, from: '+email+'\n'+'Commentary: '+comment+'\n';
        mailOptions = {
          from: 'mailer@aixkare.com',
          to: 'angela.l.m@aixkare.com',
          subject: 'Comment from AixKare from AixKare-Mailer',
          text: bodyMail
        };
    } else {
      bodyMail = 'Hemos recibido un comentario!!, de: '+email+'\n'+'Comentario: '+comment+'\n';
      mailOptions = {
        from: 'mailer@artecnologia.aixkare.com',
        to: 'angela.l.m@aixkare.com',
        subject: 'Comment from Artecnologia by Artecnologia-Mailer',
        text: bodyMail
      };
    }

      transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
          console.log("Error at sendmail(get): ",err);
          ok = false;
        } 
        if(info) {
          console.log("Ok at sendmail(get): envelope: ",info.envelope);
          console.log("Ok at sendmail(get): messageId: ",info.messageId);
          ok = true;
        }
      });

      if(ok === true) {
        if(!aixkare) {
          console.log('OK Message queued from Artecnologia to be sent successfully!');
          console.log('OK get /* call succeed, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          if(lang == 'en') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=pt");
          } else{
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
          }
        } else {
          console.log('OK Message queued from AixKare to be sent successfully!');
          console.log('OK get /* call succeed, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          if(lang == 'en') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=pt");
          } else{
            res.redirect("https://www.aixkare.com/thanks.html?lang=en");
          }
        }
      } else {
        if(!aixkare) {
          console.log('ERROR Message from Artecnologia could not be queued to be sent!!!');
          console.log('ERROR get /* call, could not be queued to be sent!!!: query: [ ',req.query,' ],[ ',email+'>,<'+comment+'>',' ] url: '+req.url);
          if(lang == 'en') {
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=pt");
          } else{
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=en");
          }
        } else {
          console.log('ERROR Message from AixKare could not be queued to be sent!!!');
          console.log('ERROR get /* call, could not be queued to be sent!!!: query: [ ',req.query,' ],[ ',email+'>,<'+comment+'>',' ] url: '+req.url);
          res.redirect("https://www.aixkare.com/index.html");
          if(lang == 'en') {
            res.redirect("https://www.aixkare.com/index.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.aixkare.com/index.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.aixkare.com/index.html?lang=pt");
          } else{
            res.redirect("https://www.aixkare.com/index.html?lang=en");
          }
        }
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
  } else if(req.method == 'POST') {
    console.log(">>>>>>>>>>>>Request (POST): {");
    console.log(req);
    console.log("}>>>>>>>>>>>>");
    const email = req.body.email;
    const comment = req.body.comment;
    const lang = req.body.lang;
    var bodyMail = "";
    var mailOptions = {};
    var ok = true;
    var aixkare = false;
    if(typeof email != 'undefined' && email != null ) {
      if(req.url.indexOf("aixkare") > -1) {
        aixkare= true;
        bodyMail = 'We have received a comment!!, from: '+email+'\n'+'Commentary: '+comment+'\n';
        mailOptions = {
          from: 'mailer@aixkare.com',
          to: 'angela.l.m@aixkare.com',
          subject: 'Comment from AixKare from AixKare-Mailer',
          text: bodyMail
        };
    } else {
      bodyMail = 'Hemos recibido un comentario!!, de: '+email+'\n'+'Comentario: '+comment+'\n';
      mailOptions = {
        from: 'mailer@artecnologia.aixkare.com',
        to: 'angela.l.m@aixkare.com',
        subject: 'Comment from Artecnologia by Artecnologia-Mailer',
        text: bodyMail
      };
    }

      transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
          console.log("Error at sendmail(post): ",err);
          ok = false;
        } 
        if(info) {
          console.log("Ok at sendmail(post): envelope: ",info.envelope);
          console.log("Ok at sendmail(post): messageId: ",info.messageId);
          ok = true;
        }
      });

      if(ok === true) {
        if(!aixkare) {
          console.log('OK Message queued from Artecnologia to be sent successfully!');
          console.log('OK get /* call succeed, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          if(lang == 'en') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=pt");
          } else{
            res.redirect("https://www.artecnologia.aixkare.com/thanks.html?lang=en");
          }
        } else {
          console.log('OK Message queued from AixKare to be sent successfully!');
          console.log('OK get /* call succeed, Message queued to sent successfully!: <'+email+'><'+comment+'>');
          if(lang == 'en') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.aixkare.com/thanks.html?lang=pt");
          } else{
            res.redirect("https://www.aixkare.com/thanks.html?lang=en");
          }
        }
      } else {
        if(!aixkare) {
          console.log('ERROR Message from Artecnologia could not be queued to be sent!!!');
          console.log('ERROR get /* call, could not be queued to be sent!!!: query: [ ',req.query,' ],[ ',email+'>,<'+comment+'>',' ] url: '+req.url);
          if(lang == 'en') {
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=pt");
          } else{
            res.redirect("https://www.artecnologia.aixkare.com/index.html?lang=en");
          }
        } else {
          console.log('ERROR Message from AixKare could not be queued to be sent!!!');
          console.log('ERROR get /* call, could not be queued to be sent!!!: query: [ ',req.query,' ],[ ',email+'>,<'+comment+'>',' ] url: '+req.url);
          res.redirect("https://www.aixkare.com/index.html");
          if(lang == 'en') {
            res.redirect("https://www.aixkare.com/index.html?lang=en");
          } else if(lang == 'es') {
            res.redirect("https://www.aixkare.com/index.html?lang=es");
          } else if(lang == 'pt') {
            res.redirect("https://www.aixkare.com/index.html?lang=pt");
          } else{
            res.redirect("https://www.aixkare.com/index.html?lang=en");
          }
        }
      }
    } else {
      console.log('WARNING Mail from Message not present in method POST, Mail did not tried to be sent');
      res.sendStatus(200);
    }
  }
});

process.on('exit', () => {
  const currentDate = new Date();
  console.log("...AixKare Mailer App v"+"10122023_1629"+" is being stopped, at: ", currentDate, ".");
 });

app.listen(3000, function() {
    const currentDate = new Date();
    console.log("AixKare Mailer App v"+"10122023_1629"+" started, at: ", currentDate, "...");
});

module.exports = app
