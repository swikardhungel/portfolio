const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

/* POST /api/contact — validate input and send email via Nodemailer */
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    // ── Basic validation ──────────────────────────────
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields (name, email, message) are required' });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // ── Create transporter ────────────────────────────
    // IMPORTANT: Replace these credentials with your own SMTP details.
    // For Gmail you can use an App Password (not your regular password).
    // See: https://support.google.com/accounts/answer/185833
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER || 'your-email@gmail.com',
            pass: process.env.SMTP_PASS || 'your-app-password'
        }
    });

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });

    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.SMTP_USER || 'your-email@gmail.com'}>`,
        to: 'sweekardhungel@gmail.com',
        subject: `Portfolio Message from ${name}`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#7c3aed;">New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background:#f4f4f5;padding:12px;border-radius:6px;">${message}</p>
        <hr style="border:none;border-top:1px solid #e0e0e0;">
        <p style="font-size:12px;color:#888;">Sent at ${timestamp}</p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Your message has been sent successfully!' });
    } catch (err) {
        console.error('Email send failed:', err.message);
        // Still return 200 so the visitor gets a nice UX — log the error server-side
        res.json({ success: true, message: 'Message received — thank you for reaching out!' });
    }
});

module.exports = router;
