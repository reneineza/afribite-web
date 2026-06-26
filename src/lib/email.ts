


import { Resend } from 'resend'

// Initialize Resend only if the API key is present to prevent crashes
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export async function sendOrderConfirmation(email: string, orderId: string, totalAmount: number, paymentMethod: string = 'stripe') {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Skipping order confirmation email.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    const data = await resend.emails.send({
      from: 'AfriBite Orders <onboarding@resend.dev>',
      to: [email],
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2B2B2B; line-height: 1.6;">
          <h1 style="color: #1B4332;">Thank you for your order!</h1>
          <p>We've successfully received your order <strong>#${orderId}</strong> and our team is already getting it ready for shipment.</p>
          <p style="font-size: 18px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <strong>Total Amount:</strong> $${totalAmount.toFixed(2)} CAD
          </p>
          
          ${paymentMethod === 'interac' ? `
          <div style="background-color: #fffaf7; border: 1px solid #ed591f; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #ed591f;">Payment Required</h3>
            <p>Your order is currently <strong>pending</strong>. To complete your order, please send an Interac e-Transfer for <strong>$${totalAmount.toFixed(2)}</strong> to:</p>
            <p style="font-size: 18px; font-weight: bold;">payments@afribite.com</p>
            <p>Please include your Order ID (<strong>#${orderId}</strong>) in the message/memo of the e-Transfer.</p>
            <p>Your order will be processed and shipped as soon as the payment is received.</p>
          </div>
          ` : ''}
          
          <h3 style="color: #1B4332; margin-top: 20px;">What's Next?</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Processing:</strong> Orders are typically processed within 12 hours.</li>
            <li><strong>Shipping:</strong> Standard delivery usually takes 2 days once shipped.</li>
            <li><strong>Updates:</strong> We will send you another email with a tracking number as soon as your package leaves our facility.</li>
          </ul>

          <h3 style="color: #1B4332; margin-top: 20px;">Track Your Order</h3>
          <p>You don't have to wait in the dark! You can check the live status of your delivery using our tracking page:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order" style="display: inline-block; background-color: #1B4332; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">Track My Order</a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If you have any questions or need to make changes, please reply to this email or visit our Help Center.<br/>
            Thank you for shopping with AfriBite!
          </p>
        </div>
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendAdminOrderNotification(orderId: string, totalAmount: number, customerEmail: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Skipping admin notification email.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@afribite.com';

  try {
    const data = await resend.emails.send({
      from: 'AfriBite System <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `New Order Received - #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2B2B2B;">
          <h1 style="color: #1B4332;">New Order Alert!</h1>
          <p>A new order (<strong>#${orderId}</strong>) has just been placed by <strong>${customerEmail}</strong>.</p>
          <p style="font-size: 18px; margin-top: 20px;"><strong>Total:</strong> $${totalAmount.toFixed(2)} CAD</p>
          <br/>
          <p>Please check the admin dashboard for more details.</p>
        </div>
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return { success: false, error }
  }
}
