const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, firstName, lastName, password, groupInfo) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Recipient
    subject: 'Welcome to the Research Group', // Subject line
    text: `Hello ${firstName} ${lastName},\n\nWelcome to the research group! Here are your credentials:\n\nEmail: ${to}\nPassword: ${password}\n\nGroup Information: ${groupInfo}\n\nBest regards,\nResearch Team`, // Plain text body
    // Update the html content in sendEmail function
html: `
<div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
  <div style="background-color: #2B6CB0; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#fff" viewBox="0 0 24 24" style="vertical-align: middle;">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
    <h1 style="color: #fff; margin: 10px 0 0 0;">Research Group Portal</h1>
  </div>

  <div style="padding: 30px; background: #fff; border-radius: 0 0 10px 10px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);">
    <h2 style="color: #2B6CB0; margin-top: 0;">Welcome, ${firstName}!</h2>
    <p style="line-height: 1.6;">We're excited to have you join our research team. Below are your login credentials and group information:</p>

    <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2B6CB0" viewBox="0 0 24 24" style="margin-right: 10px;">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        <div>
          <h3 style="margin: 0; color: #2B6CB0;">Email</h3>
          <p style="margin: 5px 0 0 0;">${to}</p>
        </div>
      </div>

      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2B6CB0" viewBox="0 0 24 24" style="margin-right: 10px;">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        <div>
          <h3 style="margin: 0; color: #2B6CB0;">Password</h3>
          <p style="margin: 5px 0 0 0;">${password}</p>
        </div>
      </div>

      <div style="display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2B6CB0" viewBox="0 0 24 24" style="margin-right: 10px;">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <div>
          <h3 style="margin: 0; color: #2B6CB0;">Group Information</h3>
          <div style="margin: 5px 0 0 0;">${groupInfo}</div>
        </div>
      </div>
    </div>

    <p style="line-height: 1.6;">Please keep your credentials secure.</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center;">
      <p style="font-size: 0.9em; color: #718096;">Best regards,<br>Research Team</p>
    </div>
  </div>
</div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendEmail,
};
