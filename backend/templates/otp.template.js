const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification - PralaySetu</title>
        <style>
            body {
                background-color: #f7fafc;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
    
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #edf2f7;
            }
    
            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
            }
    
            .logo-icon {
                background-color: #3b82f6;
                padding: 12px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 10px;
            }
    
            .logo-text {
                font-size: 24px;
                font-weight: bold;
                color: #1e40af;
            }
    
            .tagline {
                color: #4b5563;
                font-size: 14px;
            }
    
            .title {
                font-size: 22px;
                font-weight: bold;
                color: #111827;
                margin-bottom: 20px;
                text-align: center;
            }
    
            .content {
                padding: 0 15px;
                margin-bottom: 30px;
            }
    
            .otp-container {
                margin: 25px 0;
                padding: 15px;
                background-color: #f3f4f6;
                border-radius: 4px;
                text-align: center;
            }
    
            .otp-code {
                font-size: 28px;
                font-weight: bold;
                color: #3b82f6;
                letter-spacing: 5px;
            }
    
            .expiry-note {
                font-size: 14px;
                color: #6b7280;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #edf2f7;
                text-align: center;
            }
    
            .footer {
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #edf2f7;
            }
            
            .highlight {
                font-weight: bold;
                color: #4b5563;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 2c1 0 3 2 3 4v1a3 3 0 1 1-6 0V6c0-2 2-4 3-4Z" />
                            <path d="M10 5c1 0 3 2 3 4v1a3 3 0 1 1-6 0V9c0-2 2-4 3-4Z" />
                            <path d="M4 8c1 0 3 2 3 4v1a3 3 0 1 1-6 0v-1c0-2 2-4 3-4Z" />
                            <path d="M22 19c0-3-2.5-5-5-5-2 0-3.5 1.5-4 2-1.5-2-3-2-4-2-2.5 0-5 2-5 5 0 3 3 6 9 6 6 0 9-3 9-6Z" />
                        </svg>
                    </div>
                    <div class="logo-text">PralaySetu</div>
                </div>
                <div class="tagline">Bridging Crisis to Safety</div>
            </div>
            
            <div class="title">Verify Your Account</div>
            
            <div class="content">
                <p>Dear User,</p>
                <p>Thank you for choosing PralaySetu. To complete your account verification, please use the following OTP (One-Time Password):</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                </div>
                
                <p><span class="highlight">Important:</span> This OTP will expire in 5 minutes for security reasons.</p>
                
                <p>If you did not request this verification code, please ignore this email or contact support if you have concerns about your account security.</p>
            </div>
            
            <div class="expiry-note">
                This OTP is only valid for the next 5 minutes.
            </div>
            
            <div class="footer">
                <p>&copy; 2025 PralaySetu. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;
};

export { otpTemplate }