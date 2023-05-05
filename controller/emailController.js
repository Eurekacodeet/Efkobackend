const { simpleParser } = require('mailparser');
const Email = require('../model/emailModel');

// Function for sending an email
const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kirato747@gmail.com',
        pass: 'eeqmhqzfkuzxgdat',
      },
    });

    const mailOptions = {
      from: 'kirato747@gmail.com',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Function for sending an email from a client
const sendEmailFromClient = async (req, res) => {
  try {
    const { from, subject, text, fullName, phoneNumber } = req.body;

    const email = new Email({ from, subject, text, fullName, phoneNumber });

    await email.save();

    await sendAutoResponse(from, fullName);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Function for sending an auto response email
const sendAutoResponse = async (to, fullName) => {
  try {
    const subject = 'Auto Response: Thank you for your email';
    const text = `Dear client ${fullName},\n\nThank you for contacting us. This is an automated response to let you know that we have received your email and will get back to you as soon as possible.\n\nBest regards,\nsetDlink`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kirato747@gmail.com',
        pass: 'eeqmhqzfkuzxgdat',
      },
    });

    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    // console.log('Auto-response email sent successfully');
  } catch (error) {
    console.error(error);
  }
};

// Function for retrieving emails
const viewEmails = async (req, res) => {
  try {
    const emails = await Email.find().sort('-createdAt').lean().exec();

    res.json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

// Function for fetching sent emails
const fetchSentEmails = async () => {
  try {
  const imap = new Imap({
  user: 'kirato747@gmail.com',
  password: 'eeqmhqzfkuzxgdat',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
  rejectUnauthorized: false,
  },
  });
  const sentEmails = [];

const openInbox = (cb) => {
  imap.openBox('[Gmail]/Sent Mail', true, cb);
};

const fetchEmails = () => {
  return new Promise((resolve, reject) => {
    openInbox((error, mailbox) => {
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
        });
      });
    });
  });
};

await new Promise((resolve, reject) => {
  imap.once('ready', () => {
    fetchEmails()
      .then(() => {
        imap.end();
        resolve();
      })
      .catch((error) => {
        imap.end();
        reject(error);
      });
  });

  imap.once('error', (error) => {
    reject(error);
  });

  imap.connect();
});

return sentEmails;
} catch (error) {
  throw error;
  }
  };
  
  const fetchEmails = async (req, res) => {
  try {
  const [sentEmails] = await Promise.all([fetchSentEmails()]);
  const emailData = {
    sentEmails,
  };
  
  res.json(emailData);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch emails' });
  }
  };
  
  module.exports = {
  sendEmail,
  sendEmailFromClient,
  viewEmails,
  fetchEmails,
  };