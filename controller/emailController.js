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
  tlsOptions: {
    rejectUnauthorized: false
  }
});

// connect to imap server
imap.connect();

// event handlers for imap connection
imap.once('ready', () => {
  console.log('IMAP connection ready');
});

imap.once('error', (error) => {
  console.error(error);
});

imap.once('end', () => {
  //console.log('IMAP connection ended');
});

// function for sending an email
const sendEmail = (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'kirato747@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      //console.log(`Email sent: ${info.response}`);
      res.json({ message: 'Email sent successfully' });
    }
  });
};
const Email = require('../model/emailModel');

// Function for sending an email
const sendEmailFromClient = async (req, res) => {
  try {
    const { from, subject, text, fullName, phoneNumber } = req.body;
    //console.log(req.body);

    // Create a new email document
    const email = new Email({ from, subject, text, fullName, phoneNumber });

    // Save the email to the database
    await email.save();

    // Call sendAutoResponse separately
    sendAutoResponse(from, fullName);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

const sendAutoResponse = async (to, fullName) => {
  try {
    const subject = 'Auto Response: Thank you for your email';
    const text = `Dear client ${fullName},\n\nThank you for contacting us. This is an automated response to let you know that we have received your email and will get back to you as soon as possible.\n\nBest regards,\nsetDlink`;

    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    //console.log('Auto-response email sent successfully');
  } catch (error) {
    console.error(error);
  }
};

// Function for retrieving emails
const viewEmails = async (req, res) => {
  try {
    // Retrieve all emails from the database
    const emails = await Email.find().sort('-createdAt');

    res.json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};


// function for receiving emails
// const viewEmails = (req, res) => {
//   const emailList = [];

//   // Open inbox mailbox
//   imap.openBox('INBOX', true, (error, mailbox) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to fetch emails' });
//       return;
//     }

//     // Search for the latest 10 emails in inbox
//     imap.search(['ALL'], (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch emails' });
//         return;
//       }

//       // Sort the results in descending order to get the latest emails
//       const latestEmails = results.sort((a, b) => b - a).slice(0, 500);

//       // Fetch each email and parse it using mailparser
//       const fetch = imap.fetch(latestEmails, { bodies: '' });
//       fetch.on('message', (message) => {
//         let emailData = {}; // Object to store email details

//         message.on('body', (stream, info) => {
//           let buffer = '';

//           stream.on('data', (chunk) => {
//             buffer += chunk.toString('utf8');
//           });

//           stream.on('end', async () => {
//             // Parse the email using mailparser
//             const parsed = await simpleParser(buffer);

//             // Filter out unwanted emails
//             const fromText = parsed.from.text.toLowerCase();
//             const subjectText = parsed.subject.toLowerCase();
//             const emailFilters = [
//               'avira',
//               'verification code',
//               'the address may be misspelled or may not exist',
//               'delivery',
//               'undeliverable',
//               'recovery email verified',
//               'security alert',
//               'facebook',
//               'coursera',
//               'linkedin',
//               'duolingo',
//               'quora',
//               'reddit',
//               'bihance',
//               'ashampoo',
//               'webtoon',
//               'deeplearning',
//               'internshala',
//               'paypal',
//               'grammarly',
//               'no-reply',
//               'noreply',
//               'clickhelp',
//               'figma',
//               'monday',
//             ];

//             const isFilteredEmail = emailFilters.some((filter) =>
//               fromText.includes(filter) || subjectText.includes(filter)
//             );

//             if (!isFilteredEmail) {
//               // Extract the desired details from the parsed email
//               emailData.from = parsed.from.text;
//               emailData.subject = parsed.subject;
//               emailData.text = parsed.text;

//               // Add email details to the list
//               emailList.push(emailData);
//             }
//           });
//         });
//       });

//       fetch.on('end', () => {
//         //console.log('Emails fetched successfully');
//         res.json(emailList);
//       });
//     });
//   });
// };
// Fetch sent emails
const fetchSentEmails = () => {
    return new Promise((resolve, reject) => {
      const sentEmails = [];
  
      imap.openBox('[Gmail]/Sent Mail', true, (error, mailbox) => {
        if (error) {
          reject(error);
          return;
        }
  
        imap.search(['ALL'], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
  
          const fetch = imap.fetch(results, { bodies: '' });
  
          fetch.on('message', (message) => {
            let emailData = {};
  
            message.on('body', async (stream, info) => {
              let buffer = '';
  
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
  
              stream.on('end', async () => {
                const parsed = await simpleParser(buffer);
  
                emailData.from = parsed.from.text;
                emailData.subject = parsed.subject;
                emailData.text = parsed.text;
  
                sentEmails.push(emailData);
              });
            });
          });
  
          fetch.on('end', () => {
            resolve(sentEmails);
            //console.log("Emails fetched successfully")
          });
        });
      });
    });
  };
  
const fetchEmails = async (req, res) => {
    try {
      const [sentEmails] = await Promise.all([
        fetchSentEmails(),
      ]);
  
      const emailData = {
        sentEmails,
      };
      
      res.json(emailData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch emails' });
    }
  };
// export the sendEmail and viewEmails functions
module.exports = {
  sendEmail,
  sendEmailFromClient,
  viewEmails,
  fetchEmails
};