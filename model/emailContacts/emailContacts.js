const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');
const Imap = require('imap');

// create nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kirato747@gmail.com',
    pass: 'eeqmhqzfkuzxgdat'
  }
});

// create imap connection for retrieving emails
const imap = new Imap({
  user: 'kirato747@gmail.com',
  password: 'eeqmhqzfkuzxgdat',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions:{
    rejectUnauthorized:false
  }
});

// connect to imap server
imap.connect();

// event handlers for imap connection
imap.once('ready', () => {
  console.log('IMAP connection ready');

  // open inbox mailbox
  imap.openBox('INBOX', true, (error, mailbox) => {
    if (error) {
      console.error(error);
      return;
    }

    // search for all unread emails in inbox
    imap.search(['UNSEEN'], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      // fetch each email and parse it using mailparser
      results.forEach((uid) => {
        const fetch = imap.fetch(uid, { bodies: '' });

        fetch.on('message', (message) => {
          message.on('body', async (stream, info) => {
            const parsed = await simpleParser(stream);

            // log email details
            console.log(`From: ${parsed.from.text}`);
            console.log(`Subject: ${parsed.subject}`);
            console.log(`Text: ${parsed.text}`);

            // send a reply email
            const mailOptions = {
              from: 'kirato747@gmail.com',
              to: parsed.from.text,
              subject: `RE: ${parsed.subject}`,
              text: 'Thank you for your email. We will get back to you soon.'
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`Reply email sent: ${info.response}`);
              }
            });
          });
        });
      });
    });
  });
});

imap.once('error', (error) => {
  console.error(error);
});

imap.once('end', () => {
  console.log('IMAP connection ended');
});

// function for sending an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'kirato747@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

// export the sendEmail function
module.exports = {
  sendEmail
};