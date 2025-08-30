// src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import { RSVPData, APIResponse } from '@/types';
import { validateRSVP } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, attending, guests, dietaryRestrictions, message } = body;

    // Save to database
    const result = await sql`
      INSERT INTO rsvps (name, email, attending, guests, dietary_restrictions, message, created_at)
      VALUES (${name}, ${email}, ${attending}, ${guests}, ${dietaryRestrictions}, ${message}, NOW())
      RETURNING id
    `;

    const rsvpId = result.rows[0]?.id;

    // Send confirmation email
    if (attending) {
      await resend.emails.send({
        from: 'wedding@yourdomain.com',
        to: email,
        subject: `RSVP Confirmation - Sarah & James Wedding`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f43f5e; text-align: center;">Thank You for Your RSVP!</h1>
            <p>Dear ${name},</p>
            <p>We're thrilled that you'll be joining us on our special day!</p>
            <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Event Details:</h3>
              <p><strong>Date:</strong> September 15th, 2024</p>
              <p><strong>Time:</strong> 4:00 PM</p>
              <p><strong>Location:</strong> Vineyard Estate, Napa Valley</p>
            </div>
            <p>Can't wait to celebrate with you!</p>
            <p>Love,<br>Sarah & James</p>
          </div>
        `
      });
    }

    // Notify couple of new RSVP
    await resend.emails.send({
      from: 'wedding@yourdomain.com',
      to: 'sarah.james.wedding@email.com',
      subject: `New RSVP from ${name}`,
      html: `
        <h2>New RSVP Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Attending:</strong> ${attending ? 'Yes' : 'No'}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        ${dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${dietaryRestrictions}</p>` : ''}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `
    });

    return NextResponse.json({
      success: true,
      data: { id: rsvpId },
      message: 'RSVP submitted successfully'
    } as APIResponse);

  } catch (error) {
    console.error('RSVP submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to submit RSVP. Please try again.'
    } as APIResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin endpoint to get all RSVPs
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');
    
    if (adminKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as APIResponse, { status: 401 });
    }

    const result = await sql`
      SELECT * FROM rsvps 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: result.rows
    } as APIResponse);

  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch RSVPs'
    } as APIResponse, { status: 500 });
  }
} body: RSVPData = await request.json();
    
    // Validate the data
    const validation = validateRSVP(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data provided',
        details: validation.errors
      } as APIResponse, { status: 400 });
    }
