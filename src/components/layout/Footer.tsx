import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import { NewsletterForm } from "@/components/NewsletterForm"

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-background border-t border-primary/10">
      {/* Very subtle elegant background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent to-primary/3"></div>
      
      <div className="container relative mx-auto px-4 py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Brand & Newsletter Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative">
                <Image src="/afribite-official.png" alt="AfriBite Logo" width={180} height={48} className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-[1.02]" />
              </div>
            </Link>
            <p className="text-foreground/70 text-sm leading-relaxed mb-8 max-w-sm">
              Your premier destination for authentic African groceries, spices, snacks, and specialty ingredients in Canada. Bringing the taste of home right to your doorstep.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2 tracking-wide uppercase">
                <Mail className="h-4 w-4 text-secondary" />
                Join our newsletter
              </h4>
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Shop Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold mb-6 text-foreground tracking-wide uppercase">Shop</h3>
            <ul className="space-y-4">
              {['Shop', 'Categories', 'Deals', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-foreground/70 text-sm hover:text-primary transition-all duration-300 flex items-center group relative w-fit font-medium"
                  >
                    <span className="w-0 h-[2px] bg-secondary absolute left-0 -bottom-1 transition-all duration-300 group-hover:w-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold mb-6 text-foreground tracking-wide uppercase">Support</h3>
            <ul className="space-y-4">
              {['FAQ', 'Shipping Policy', 'Returns', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.split(' ')[0].toLowerCase()}`} 
                    className="text-foreground/70 text-sm hover:text-primary transition-all duration-300 flex items-center group relative w-fit font-medium"
                  >
                    <span className="w-0 h-[2px] bg-secondary absolute left-0 -bottom-1 transition-all duration-300 group-hover:w-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-bold mb-6 text-foreground tracking-wide uppercase">Get In Touch</h3>
            <ul className="space-y-5">
              <li>
                <a href="https://maps.app.goo.gl/zEGS7GMnPHH2eMKS9?g_st=iw" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-sm text-foreground/70 hover:text-primary transition-colors group font-medium">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10 shadow-sm">
                    <MapPin className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <span className="mt-1">206 Rue Antoinette-Robidoux<br/>Longueuil, QC J4J 2V3</span>
                </a>
              </li>
              <li>
                <a href="tel:+250789284564" className="flex items-center gap-4 text-sm text-foreground/70 hover:text-primary transition-colors group font-medium">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10 shadow-sm">
                    <Phone className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <span>+250 789 284 564</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@afribite.com" className="flex items-center gap-4 text-sm text-foreground/70 hover:text-primary transition-colors group font-medium">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10 shadow-sm">
                    <Mail className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <span>info@afribite.com</span>
                </a>
              </li>
            </ul>
            
            <div className="flex space-x-4 mt-8">
              {[
                { icon: FacebookIcon, label: 'Facebook' },
                { icon: InstagramIcon, label: 'Instagram' },
                { icon: TwitterIcon, label: 'Twitter' }
              ].map((social) => (
                <a 
                  key={social.label} 
                  href="#" 
                  className="relative group h-12 w-12 flex items-center justify-center"
                >
                  <div className="relative h-10 w-10 bg-white border border-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:-translate-y-1 shadow-sm">
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-primary/10">
          <p className="text-foreground/60 text-sm text-center md:text-left font-medium">
            © {new Date().getFullYear()} AfriBite Canada. All rights reserved.
          </p>
          
          {/* Payment Badges */}
          <div className="flex items-center flex-wrap justify-center gap-4">
            <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold mr-2">Secure Checkout</span>
            <div className="flex space-x-3">
              {['STRIPE', 'VISA', 'MASTERCARD', 'AMEX'].map((badge) => (
                <div 
                  key={badge} 
                  className="bg-white px-3 py-1.5 rounded text-[10px] font-bold text-foreground/70 shadow-sm border border-primary/10 flex items-center hover:border-primary/30 transition-colors"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
