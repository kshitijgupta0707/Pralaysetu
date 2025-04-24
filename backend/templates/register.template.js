const registrationSuccessTemplate = (userEmail) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Successful - PralaySetu</title>
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
    
            .cta-button {
                display: block;
                background-color: #3b82f6;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 24px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin: 30px auto;
                max-width: 250px;
            }
    
            .highlight-container {
                margin: 25px 0;
                padding: 15px;
                background-color: #f3f4f6;
                border-radius: 4px;
                text-align: center;
            }
    
            .email-highlight {
                font-size: 16px;
                font-weight: bold;
                color: #3b82f6;
            }
    
            .success-icon {
                color: #10b981;
                font-size: 48px;
                margin-bottom: 15px;
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
            
            <div class="title">Registration Successful</div>
            
            <div class="content">
                <div class="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <p>Dear User,</p>
                <p>Congratulations! Your registration with PralaySetu has been successful.</p>
                
                <p>You can now log in to your account using:</p>
                
                <div class="highlight-container">
                    <span class="email-highlight">${userEmail}</span>
                </div>
                
                <p>Thank you for your patience and for choosing PralaySetu. We're excited to have you as part of our community.</p>
                
                <a href="https://pralaysetu.vercel.app/login" class="cta-button">Login to Your Account</a>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 PralaySetu. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;
};

const registrationDeniedTemplate = () => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Request - PralaySetu</title>
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
    
            .cta-button {
                display: block;
                background-color: #3b82f6;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 24px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin: 30px auto;
                max-width: 250px;
            }
    
            .message-container {
                margin: 25px 0;
                padding: 15px;
                background-color: #fee2e2;
                border-radius: 4px;
                text-align: center;
                border-left: 4px solid #ef4444;
            }
    
            .message-text {
                font-size: 16px;
                color: #b91c1c;
            }
    
            .notice-icon {
                color: #ef4444;
                font-size: 48px;
                margin-bottom: 15px;
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
            
            <div class="title">Registration Request Update</div>
            
            <div class="content">
                <div class="notice-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                
                <p>Dear User,</p>
                <p>We regret to inform you that your registration request for PralaySetu has been denied.</p>
                
                <div class="message-container">
                    <p class="message-text">Please enter your correct documents to complete the registration process.</p>
                </div>
                
                <p>To ensure a successful registration, please make sure:</p>
                <ul>
                    <li>All submitted documents are clearly legible</li>
                    <li>Information provided matches your identification documents</li>
                    <li>All required fields are properly filled out</li>
                </ul>
                
                <p>You can resubmit your registration by clicking the button below:</p>
                
                <a href="https://pralaysetu.vercel.app/login" class="cta-button">Try Again</a>
                
                <p>If you need further assistance, please contact our support team.</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 PralaySetu. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;
};
const registrationRequestTemplate = (registerAs) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Request Received - PralaySetu</title>
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
    
            .status-container {
                margin: 25px 0;
                padding: 15px;
                background-color: #eff6ff;
                border-radius: 4px;
                text-align: center;
                border-left: 4px solid #3b82f6;
            }
    
            .status-text {
                font-size: 16px;
                color: #1e40af;
                font-weight: bold;
            }
    
            .info-icon {
                color: #3b82f6;
                font-size: 48px;
                margin-bottom: 15px;
            }
    
            .role-highlight {
                font-weight: bold;
                color: #3b82f6;
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
            
            <div class="title">Registration Request Received</div>
            
            <div class="content">
                <div class="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
                
                <p>Dear User,</p>
                <p>Thank you for your interest in PralaySetu. We have received your request to register as a <span class="role-highlight">${registerAs}</span>.</p>
                
                <div class="status-container">
                    <p class="status-text">Your registration is currently being processed.</p>
                </div>
                
                <p>Our team is reviewing your application and will notify you of the status soon. This process typically takes 24-48 hours.</p>
                
                <p><span class="highlight">What's next?</span> Once your registration is approved, you will receive a confirmation email with instructions to access your account.</p>
                
                <p>We appreciate your patience during this process. If you have any questions, please contact our support team.</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 PralaySetu. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;
};
const thankYouTemplate = (userName) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Registering - PralaySetu</title>
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
    
            .cta-button {
                display: block;
                background-color: #3b82f6;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 24px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin: 30px auto;
                max-width: 250px;
            }
    
            .thank-you-icon {
                text-align: center;
                margin: 20px 0;
            }
    
            .features-container {
                margin: 25px 0;
                padding: 15px;
                background-color: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
    
            .feature-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 12px;
            }
    
            .feature-icon {
                color: #3b82f6;
                margin-right: 10px;
                flex-shrink: 0;
            }
    
            .feature-text {
                flex-grow: 1;
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
            
            <div class="title">Thank You for Registering!</div>
            
            <div class="content">
                <div class="thank-you-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10"></path>
                        <path d="M8 12h8"></path>
                        <path d="M12 16V8"></path>
                    </svg>
                </div>
                
                <p>Dear ${userName || 'User'},</p>
                <p>Welcome to PralaySetu! Thank you for registering with us. We're thrilled to have you join our community dedicated to crisis management and safety.</p>
                
                <p>Your registration is complete, and you now have access to all the features and resources available on our platform.</p>
                
                <div class="features-container">
                    <h3 style="margin-top: 0;">What you can do with PralaySetu:</h3>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="feature-text">Access real-time emergency alerts and notifications</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="feature-text">Find safety resources and emergency contacts</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="feature-text">Connect with community responders and volunteers</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="feature-text">Participate in disaster preparedness programs</div>
                    </div>
                </div>
                
                <p>To get started, click the button below to log in to your account:</p>
                
                <a href="https://pralaysetu.vercel.app/login" class="cta-button">Login Now</a>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <p>Thank you for being part of our mission to create safer communities!</p>
                
                <p>Best regards,<br>The PralaySetu Team</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 PralaySetu. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>`;
};

export { registrationSuccessTemplate, registrationDeniedTemplate , registrationRequestTemplate , thankYouTemplate }