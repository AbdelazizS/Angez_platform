<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Service Status Update</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="background-color: #f8fafc; padding: 32px 0; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
                @if($status === 'approved')
                    <span style="background-color: #ECFDF5; color: #065F46; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                        ✅ Service Approved!
                    </span>
                @else
                    <span style="background-color: #FEF2F2; color: #991B1B; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
                        ❌ Changes Required
                    </span>
                @endif
            </div>

            <!-- Main Content -->
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                @if($status === 'approved')
                    Congratulations! Your Service Has Been Approved
                @else
                    Service Submission Requires Changes
                @endif
            </h1>
            <p style="color: #475569; margin-bottom: 24px; text-align: center;">
                @if($status === 'approved')
                    Great news! Your service has been reviewed and approved by our admin team. It's now live and available for clients to order.
                @else
                    Your service submission has been reviewed and requires some changes before it can be approved.
                @endif
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
                        <td style="padding: 8px 0; color: #64748b;">Status:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 500; text-align: right;">
                            @if($status === 'approved')
                                <span style="color: #059669;">Active</span>
                            @else
                                <span style="color: #dc2626;">Pending Review</span>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
            @if($status !== 'approved' && $reason)
            <!-- Rejection Reason -->
            <div style="background-color: #fef2f2; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #dc2626;">
                <h2 style="color: #991b1b; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Changes Required
                </h2>
                <p style="color: #991b1b; margin: 0;">{{ $reason }}</p>
            </div>
            @endif
            @if($status === 'approved')
            <!-- Next Steps for Approved Services -->
            <div style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                <h2 style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    What's Next?
                </h2>
                <ol style="color: #065f46; margin: 0; padding-left: 24px;">
                    <li style="margin-bottom: 8px;">Your service is now visible to potential clients</li>
                    <li style="margin-bottom: 8px;">Start receiving order requests</li>
                    <li style="margin-bottom: 8px;">Maintain high-quality service to get positive reviews</li>
                    <li style="margin-bottom: 8px;">Consider promoting your service on social media</li>
                </ol>
            </div>
            @endif
           
            @if($status === 'approved')
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ route('freelancers.dashboard') }}" style="background-color: #64748b; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Go to Dashboard</a>
            </div>
            @endif
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 32px;">
                @if($status === 'approved')
                    Thank you for providing quality services to our community!
                @else
                    Please make the necessary changes and resubmit your service for review.
                @endif
            </p>
        
        
        </div>
    </div>
</body>
</html> 