const getEmailTemplate = (type, data) => {
    const baseStyle = `
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0f172a;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1e293b;
      border-radius: 16px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .content {
      padding: 40px 30px;
      color: #f8fafc;
    }
    .content h2 {
      color: #e11d48;
      margin-top: 0;
    }
    .content p {
      line-height: 1.8;
      color: #cbd5e1;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background-color: #e11d48;
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #be123c;
    }
    .footer {
      background-color: #0f172a;
      padding: 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
    }
    .divider {
      height: 1px;
      background-color: #334155;
      margin: 30px 0;
    }
  `;

    if (type === 'verification') {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${baseStyle}</style>
      </head>
      <body>
        <div style="padding: 20px; background-color: #0f172a;">
          <div class="container">
            <div class="header">
              <h1>
                <span style="font-size: 40px;">💖</span>
                HeartDrop
              </h1>
              <p style="color: #fecdd3; margin: 10px 0 0 0; font-size: 16px;">Anonymous Confessions Platform</p>
            </div>
            <div class="content">
              <h2>Welcome to HeartDrop! 🎉</h2>
              <p>Thank you for joining our community of anonymous hearts. We're excited to have you here!</p>
              <p>To start sharing your confessions and connecting with others, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <div class="divider"></div>
              <p style="font-size: 14px; color: #94a3b8;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${data.verificationUrl}" style="color: #e11d48; word-break: break-all;">${data.verificationUrl}</a>
              </p>
              <p style="font-size: 14px; color: #94a3b8;">
                This link will expire in 24 hours for security reasons.
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0;">
                <strong>HeartDrop</strong> - Share Your Secrets, Anonymously
              </p>
              <p style="margin: 0; font-size: 12px;">
                If you didn't create an account, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    if (type === 'welcome') {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${baseStyle}</style>
      </head>
      <body>
        <div style="padding: 20px; background-color: #0f172a;">
          <div class="container">
            <div class="header">
              <h1>
                <span style="font-size: 40px;">💖</span>
                HeartDrop
              </h1>
            </div>
            <div class="content">
              <h2>Email Verified Successfully! ✅</h2>
              <p>Congratulations! Your email has been verified and your account is now active.</p>
              <p>You can now:</p>
              <ul style="color: #cbd5e1; line-height: 2;">
                <li>Share your confessions anonymously</li>
                <li>Browse public confessions from others</li>
                <li>Reply to confessions publicly or privately</li>
                <li>Manage your profile and aliases</li>
              </ul>
              <div style="text-align: center;">
                <a href="${data.loginUrl}" class="button">Login to HeartDrop</a>
              </div>
              <div class="divider"></div>
              <p style="font-size: 14px; color: #94a3b8;">
                <strong>Tips for using HeartDrop:</strong><br>
                • Use different aliases to maintain anonymity<br>
                • Be respectful and kind to others<br>
                • Report any inappropriate content<br>
                • Your identity is always protected
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0;">
                <strong>HeartDrop</strong> - Share Your Secrets, Anonymously
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    return '';
};

export default getEmailTemplate;
