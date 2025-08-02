<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Service Submission</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Alert Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #FEE2E2; color: #991B1B; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                    🆕 New Service Submission
                </span>
            </div>
            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                New Service Submission Requires Review
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                A freelancer has submitted a new service that requires your review and approval.
            </p>
            <!-- Service Details Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Service Information
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Service Title:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->title }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Category:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->category }}</td>
                    </tr>
                    @if($service->subcategory)
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Subcategory:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->subcategory }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Starting Price:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ number_format($service->price, 0, '.', ',') }} SDG</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Delivery Time:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->delivery_time }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Revisions:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->revisions }}</td>
                    </tr>
                </table>
            </div>
            <!-- Freelancer Information Card -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Freelancer Information
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Name:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->user->name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Email:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->user->email }}</td>
                    </tr>
                    @if($service->user->phone)
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Phone:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->user->phone }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;">Member Since:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">{{ $service->user->created_at->format('F j, Y') }}</td>
                    </tr>
                </table>
            </div>
            @if($service->description)
            <!-- Service Description -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #334155; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Service Description
                </h2>
                <div style="background-color: white; border-radius: 6px; padding: 16px; border-left: 4px solid #0C4A6E;">
                    <p style="color: #475569; margin: 0;">{{ Str::limit($service->description, 300) }}</p>
                </div>
            </div>
            @endif
            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('admin.services.show', $service) }}" style="background-color: #0C4A6E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; margin-bottom: 8px;">Review Service</a>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('admin.services.index') }}" style="background-color: #64748b; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">View All Services</a>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                Please review this service submission and take appropriate action (approve, reject, or request changes).
            </p>
        </div>
    </div>
</body>
</html> 