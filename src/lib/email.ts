import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(email: string, orderId: string, totalAmount: number) {
  try {
    const data = await resend.emails.send({
      from: 'AfriBite Orders <orders@afribite.ca>',
      to: [email],
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2B2B2B;">
          <h1 style="color: #1B4332;">Thank you for your order!</h1>
          <p>We've received your order <strong>#${orderId}</strong> and are getting it ready for shipment.</p>
          <p style="font-size: 18px; margin-top: 20px;"><strong>Total:</strong> $${totalAmount.toFixed(2)} CAD</p>
          <br/>
          <p>You can track your order status in your dashboard.</p>
          <p>Thank you for shopping with AfriBite!</p>
        </div>
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error }
  }
}
