import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendInquiryAutoReply, sendInquiryToAdmin } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Store the inquiry in the database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
        },
      ]);

    if (dbError) {
      console.error('Error inserting contact message:', dbError);
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    // Send emails
    const autoReplyResult = await sendInquiryAutoReply(email, name);
    const adminNotificationResult = await sendInquiryToAdmin(email, name, subject, message);

    if (!autoReplyResult?.success || !adminNotificationResult?.success) {
      console.error('Email sending failed for inquiry', { autoReplyResult, adminNotificationResult });
      // We still return success if it saved to DB, but maybe log it.
    }

    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('API Contact Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
