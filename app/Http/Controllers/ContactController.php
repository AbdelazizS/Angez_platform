<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact');
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|min:5|max:255',
            'message' => 'required|string|min:10|max:2000',
        ]);

        try {
            // Send email notification
            Mail::to(config('app.admin_email', 'admin@yourdomain.com'))->queue(new ContactFormMail($validated));
            
            return back()->with('success', 'Message sent successfully! We\'ll get back to you soon.');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'There was an error sending your message. Please try again.']);
        }
    }
} 