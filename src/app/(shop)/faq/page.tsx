import { HelpCircle } from 'lucide-react'

const faqs = [
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay for your convenience and security.' },
  { question: 'How long does shipping take?', answer: 'Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days, while expedited shipping takes 1-2 business days.' },
  { question: 'Do you ship internationally?', answer: 'Currently, we ship within Canada and the United States. We are working hard to bring AfriBite to more countries soon!' },
  { question: 'What is your return policy?', answer: 'We offer a 30-day return policy on non-perishable items. Perishable food items cannot be returned due to safety regulations, but if there is an issue with your order, please contact our support team.' },
  { question: 'Are your products authentic?', answer: 'Absolutely! We source our products directly from trusted suppliers and farmers across Africa to ensure 100% authenticity and premium quality.' },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 py-16 md:py-24 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border border-primary/10 text-primary mb-6 shadow-sm">
            <HelpCircle className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">Have questions? We have answers. If you can&apos;t find what you&apos;re looking for, feel free to contact our support team.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white border border-primary/10 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-foreground font-medium hover:bg-primary/5 transition-colors">
                <h2 className="text-lg">{faq.question}</h2>
                <span className="shrink-0 rounded-full bg-white p-1.5 text-foreground border border-primary/10 group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <div className="p-5 pt-0 text-foreground/70 leading-relaxed border-t border-primary/5">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
