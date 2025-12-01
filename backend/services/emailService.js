// Email notification service using Nodemailer
import nodemailer from 'nodemailer';

// Create transporter (configure with your SMTP settings)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const templates = {
  bookDue: (memberEmail, bookTitle, dueDate) => ({
    from: process.env.SMTP_FROM || 'library@example.com',
    to: memberEmail,
    subject: 'Book Due Reminder - Library Lite',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Book Due Reminder</h2>
        <p>This is a friendly reminder that the following book is due soon:</p>
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #1f2937;">${bookTitle}</h3>
          <p style="margin: 10px 0 0 0; color: #4b5563;">Due Date: ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please return the book by the due date to avoid late fees.</p>
        <p style="color: #6b7280; font-size: 14px;">Thank you for using Library Lite!</p>
      </div>
    `,
  }),

  bookOverdue: (memberEmail, bookTitle, daysOverdue, fine) => ({
    from: process.env.SMTP_FROM || 'library@example.com',
    to: memberEmail,
    subject: 'Overdue Book Notice - Library Lite',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Overdue Book Notice</h2>
        <p>The following book is overdue:</p>
        <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid #ef4444;">
          <h3 style="margin: 0; color: #1f2937;">${bookTitle}</h3>
          <p style="margin: 10px 0 0 0; color: #4b5563;">Days Overdue: ${daysOverdue}</p>
          <p style="margin: 10px 0 0 0; color: #991b1b; font-weight: bold;">Current Fine: $${fine.toFixed(2)}</p>
        </div>
        <p>Please return the book as soon as possible to minimize late fees.</p>
        <p style="color: #6b7280; font-size: 14px;">Thank you for your attention to this matter.</p>
      </div>
    `,
  }),

  bookReserved: (memberEmail, bookTitle) => ({
    from: process.env.SMTP_FROM || 'library@example.com',
    to: memberEmail,
    subject: 'Book Reserved Successfully - Library Lite',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Book Reserved!</h2>
        <p>Your book reservation has been confirmed:</p>
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #1f2937;">${bookTitle}</h3>
          <p style="margin: 10px 0 0 0; color: #4b5563;">Status: Reserved</p>
        </div>
        <p>We'll notify you when the book becomes available for pickup.</p>
        <p style="color: #6b7280; font-size: 14px;">Thank you for using Library Lite!</p>
      </div>
    `,
  }),

  bookAvailable: (memberEmail, bookTitle, expiryDate) => ({
    from: process.env.SMTP_FROM || 'library@example.com',
    to: memberEmail,
    subject: 'Reserved Book Available - Library Lite',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Your Reserved Book is Available!</h2>
        <p>Great news! The book you reserved is now available for pickup:</p>
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
          <h3 style="margin: 0; color: #1f2937;">${bookTitle}</h3>
          <p style="margin: 10px 0 0 0; color: #4b5563;">Available until: ${new Date(expiryDate).toLocaleDateString()}</p>
        </div>
        <p>Please pick up the book by the expiry date, or your reservation will be cancelled.</p>
        <p style="color: #6b7280; font-size: 14px;">Thank you for using Library Lite!</p>
      </div>
    `,
  }),

  membershipExpiring: (memberEmail, expiryDate) => ({
    from: process.env.SMTP_FROM || 'library@example.com',
    to: memberEmail,
    subject: 'Membership Expiring Soon - Library Lite',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Membership Expiring Soon</h2>
        <p>Your Library Lite membership is expiring soon:</p>
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #4b5563; font-size: 18px;">Expiry Date: ${new Date(expiryDate).toLocaleDateString()}</p>
        </div>
        <p>Please renew your membership to continue enjoying our services.</p>
        <p style="color: #6b7280; font-size: 14px;">Thank you for being a valued member!</p>
      </div>
    `,
  }),
};

/**
 * Send an email notification
 * @param {string} type - Type of notification (bookDue, bookOverdue, bookReserved, bookAvailable, membershipExpiring)
 * @param {Object} data - Data for the email template
 * @returns {Promise<boolean>} - True if email sent successfully
 */
export const sendEmail = async (type, data) => {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP not configured. Email not sent:', type);
      return false;
    }

    const transporter = createTransporter();
    const template = templates[type];

    if (!template) {
      throw new Error(`Unknown email template type: ${type}`);
    }

    const mailOptions = template(...Object.values(data));
    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully: ${type} to ${mailOptions.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send due date reminders for loans
 * @param {Array} loans - Array of loans with user and book information
 */
export const sendDueReminders = async (loans) => {
  const results = await Promise.allSettled(
    loans.map(loan =>
      sendEmail('bookDue', {
        memberEmail: loan.user.email,
        bookTitle: loan.book.title,
        dueDate: loan.dueDate,
      })
    )
  );

  const sent = results.filter(r => r.status === 'fulfilled' && r.value).length;
  console.log(`Sent ${sent}/${loans.length} due date reminders`);
  return sent;
};

/**
 * Send overdue notices for loans
 * @param {Array} loans - Array of overdue loans with fine information
 */
export const sendOverdueNotices = async (loans) => {
  const results = await Promise.allSettled(
    loans.map(loan => {
      const daysOverdue = Math.ceil((Date.now() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24));
      return sendEmail('bookOverdue', {
        memberEmail: loan.user.email,
        bookTitle: loan.book.title,
        daysOverdue,
        fine: loan.fine || 0,
      });
    })
  );

  const sent = results.filter(r => r.status === 'fulfilled' && r.value).length;
  console.log(`Sent ${sent}/${loans.length} overdue notices`);
  return sent;
};

/**
 * Send reservation confirmation
 * @param {Object} reservation - Reservation object with user and book
 */
export const sendReservationConfirmation = async (reservation) => {
  return await sendEmail('bookReserved', {
    memberEmail: reservation.user.email,
    bookTitle: reservation.book.title,
  });
};

/**
 * Send book available notification
 * @param {Object} reservation - Reservation object when book becomes available
 */
export const sendBookAvailableNotification = async (reservation) => {
  return await sendEmail('bookAvailable', {
    memberEmail: reservation.user.email,
    bookTitle: reservation.book.title,
    expiryDate: reservation.expiresAt,
  });
};

/**
 * Send membership expiry reminder
 * @param {Object} member - Member object with user and expiry date
 */
export const sendMembershipExpiryReminder = async (member) => {
  return await sendEmail('membershipExpiring', {
    memberEmail: member.user.email,
    expiryDate: member.expiryDate,
  });
};

export default {
  sendEmail,
  sendDueReminders,
  sendOverdueNotices,
  sendReservationConfirmation,
  sendBookAvailableNotification,
  sendMembershipExpiryReminder,
};
