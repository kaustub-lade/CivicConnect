import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || 'noreply@civicconnect.com';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Email templates
export const emailTemplates = {
  complaintCreated: (complaint: any, userEmail: string) => ({
    to: userEmail,
    subject: `✅ Complaint Registered - ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Complaint Registered Successfully</h2>
        <p>Dear User,</p>
        <p>Your complaint has been registered with the following details:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Location:</strong> ${complaint.location.area}</p>
          <p><strong>Status:</strong> <span style="color: #EAB308;">${complaint.status}</span></p>
        </div>
        <p>We will keep you updated on the progress. You can track your complaint on our dashboard.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Dashboard
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for using CivicConnect!<br/>
          Together, we make our community better.
        </p>
      </div>
    `,
  }),

  complaintUpdated: (complaint: any, update: any, userEmail: string) => ({
    to: userEmail,
    subject: `📝 Update on Your Complaint - ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Complaint Update</h2>
        <p>Dear User,</p>
        <p>There's an update on your complaint:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Complaint:</strong> ${complaint.title}</p>
          <p><strong>New Status:</strong> <span style="color: #F59E0B;">${complaint.status}</span></p>
          <p><strong>Update:</strong> ${update.message}</p>
          <p><strong>Updated By:</strong> ${update.updatedBy}</p>
        </div>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Details
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for your patience!<br/>
          CivicConnect Team
        </p>
      </div>
    `,
  }),

  complaintResolved: (complaint: any, userEmail: string) => ({
    to: userEmail,
    subject: `✅ Complaint Resolved - ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">🎉 Complaint Resolved!</h2>
        <p>Dear User,</p>
        <p>Great news! Your complaint has been successfully resolved.</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
          <p><strong>Complaint:</strong> ${complaint.title}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Location:</strong> ${complaint.location.area}</p>
          <p><strong>Status:</strong> <span style="color: #10B981;">✓ Resolved</span></p>
        </div>
        <p>Thank you for reporting this issue and helping improve our community!</p>
        <p>Would you like to share your feedback on the resolution?</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Dashboard
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Together we make our community better!<br/>
          CivicConnect Team
        </p>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail(emailOptions: any) {
  try {
    const info = await transporter.sendMail({
      from: `"CivicConnect" <${EMAIL_USER}>`,
      ...emailOptions,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
