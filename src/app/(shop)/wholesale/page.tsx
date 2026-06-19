"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function WholesalePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    const business_name = formData.get('business_name') as string
    const contact_name = formData.get('contact_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const details = formData.get('details') as string

    const supabase = createClient()
    
    const { error } = await supabase
      .from('wholesale_applications')
      .insert([
        { business_name, contact_name, email, phone, details }
      ])

    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner with AfriBite</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Provide your customers with the highest quality, authentic African ingredients. Apply for a wholesale account today.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            
            {/* Info */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground">Why Wholesale?</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Premium Sourcing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We deal directly with producers in West Africa, ensuring you get the freshest and most authentic spices and grains available in North America.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Bulk Pricing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Enjoy significant discounts on volume orders. Whether you run a restaurant, catering service, or grocery store, our pricing scales with your needs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Dedicated Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get priority customer service, custom procurement requests, and reliable nationwide shipping across Canada.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-xl border border-border mt-8">
                <h4 className="font-bold text-foreground mb-2">Direct Inquiries</h4>
                <p className="text-muted-foreground mb-1">Email: <a href="mailto:info@afribite.com" className="text-primary hover:underline">info@afribite.com</a></p>
                <p className="text-muted-foreground">Phone: +250789284564 (Mon-Fri, 9am-5pm)</p>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-card p-8 rounded-2xl shadow-xl border border-border relative">
              <h2 className="text-2xl font-bold text-foreground mb-6">Wholesale Application</h2>
              
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-green-50/50 rounded-xl border border-green-200">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl">✓</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Application Received!</h3>
                  <p className="text-green-700">Thank you for your interest. Our wholesale team will review your application and contact you within 2-3 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="business_name" className="text-sm font-medium text-foreground">Business Name</label>
                    <input 
                      type="text" 
                      id="business_name" 
                      name="business_name" 
                      required 
                      className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact_name" className="text-sm font-medium text-foreground">Contact Person</label>
                    <input 
                      type="text" 
                      id="contact_name" 
                      name="contact_name" 
                      required 
                      className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="details" className="text-sm font-medium text-foreground">Tell us about your business & volume needs</label>
                    <textarea 
                      id="details" 
                      name="details" 
                      rows={4} 
                      required 
                      className="w-full p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  
                  {status === 'error' && (
                    <p className="text-destructive text-sm">Failed to submit application. Please try again.</p>
                  )}

                  <Button type="submit" disabled={status === 'loading'} className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                    {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
