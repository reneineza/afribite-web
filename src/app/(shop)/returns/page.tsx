import { RefreshCcw } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 py-16 md:py-24 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border border-primary/10 text-primary mb-6 shadow-sm">
            <RefreshCcw className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Returns & Refunds</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">Our commitment to quality means we stand behind our products. Here is our straightforward return policy.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl border border-primary/10 shadow-sm space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">30-Day Guarantee</h2>
            <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Perishable Items</h2>
            <p>Due to health and safety regulations, we cannot accept returns on perishable goods (such as fresh food, vegetables, or certain packed goods). Please get in touch if you have questions or concerns about your specific item.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How to Start a Return</h2>
            <p>To start a return, you can contact us at info@afribite.com. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Refunds</h2>
            <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
