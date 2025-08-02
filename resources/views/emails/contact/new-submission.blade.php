<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Alert Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #FEE2E2; color: #991B1B; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    📧 New Contact Form Submission
                </span>
            </div>
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                New Contact Form Submission
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                A new contact form submission has been received and requires your attention.
            </p>
            <!-- Contact Information Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Contact Information
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Name:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $contactData['name'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Email:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $contactData['email'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Subject:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $contactData['subject'] }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Submitted:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ now()->format('F j, Y \a\t g:i A') }}</td>
                    </tr>
                </table>
            </div>
            <!-- Message Content -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Message Content
                </h2>
                <div style="background-color: white; border-radius: 6px; padding: 16px; border-left: 4px solid #0C4A6E;">
                    <p style="color: #475569; margin: 0; white-space: pre-wrap;">{{ $contactData['message'] }}</p>
                </div>
            </div>
            <!-- Quick Actions -->
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #0C4A6E;">
                <h2 style="color: #0C4A6E; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Quick Actions
                </h2>
                <ul style="color: #0C4A6E; margin: 0; padding-left: 24px;">
                    <li style="margin-bottom: 8px;">Reply directly to: <a href="mailto:{{ $contactData['email'] }}" style="color: #0C4A6E;">{{ $contactData['email'] }}</a></li>
                    <li style="margin-bottom: 8px;">Review the message content above</li>
                    <li style="margin-bottom: 8px;">Take appropriate action based on the inquiry</li>
                    <li style="margin-bottom: 8px;">Follow up with the customer if needed</li>
                </ul>
            </div>
            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="mailto:{{ $contactData['email'] }}?subject=Re: {{ $contactData['subject'] }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-bottom: 8px;">Reply to Customer</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('admin.dashboard') }}" style="background-color: #64748b; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Go to Admin Dashboard</a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Please respond to this inquiry in a timely manner to maintain good customer service.
            </p>
        </div>
    </div>
</body>
</html>