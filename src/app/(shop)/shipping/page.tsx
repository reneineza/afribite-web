import { Truck } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 py-16 md:py-24 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border border-primary/10 text-primary mb-6 shadow-sm">
            <Truck className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Shipping Policy</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">Everything you need to know about how we deliver your favorite African products right to your door.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-lg max-w-none text-foreground/80">
          <div className="bg-white p-8 rounded-2xl border border-primary/10 shadow-sm space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Order Processing Time</h2>
              <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Domestic Shipping Rates and Estimates</h2>
              <p className="mb-4">Shipping charges for your order will be calculated and displayed at checkout.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="py-3 px-4 font-semibold text-foreground">Shipping option</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Estimated delivery time</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-primary/5">
                      <td className="py-3 px-4">Standard Shipping</td>
                      <td className="py-3 px-4">3 to 5 business days</td>
                      <td className="py-3 px-4">$9.99</td>
                    </tr>
                    <tr className="border-b border-primary/5">
                      <td className="py-3 px-4">Expedited Shipping</td>
                      <td className="py-3 px-4">1 to 2 business days</td>
                      <td className="py-3 px-4">$19.99</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Free Standard Shipping</td>
                      <td className="py-3 px-4">3 to 5 business days</td>
                      <td className="py-3 px-4">Free on orders over $75</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Local Delivery</h2>
              <p>Free local delivery is available for orders over $50 within Longueuil, QC. For orders under $50, we charge a $5 local delivery fee. Deliveries are made from 9 AM to 5 PM on weekdays. We will contact you via text message with the phone number you provided at checkout to notify you on the day of our arrival.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
