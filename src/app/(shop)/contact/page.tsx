"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    const supabase = createClient()
    
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        { name, email, subject, message }
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question about your order, a product, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
            <h2 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Our Headquarters</h3>
                  <p className="text-muted-foreground mt-1">123 African Market Way<br />Toronto, ON M5V 2H1<br />Canada</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground mt-1">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground mt-1">support@afribite.ca</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Hours</h3>
                  <p className="text-muted-foreground mt-1">Monday - Friday: 9am - 6pm EST<br />Saturday: 10am - 4pm EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
          
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
              <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setStatus('idle')}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  required 
                  className="w-full h-11 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Order Inquiry"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  required 
                  className="w-full p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              
              {status === 'error' && (
                <p className="text-destructive text-sm">There was an error sending your message. Please try again.</p>
              )}

              <Button type="submit" disabled={status === 'loading'} className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
