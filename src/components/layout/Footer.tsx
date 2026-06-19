import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"

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
    <footer className="bg-background relative border-t border-border/50 mt-auto overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent to-primary/5 opacity-50"></div>
      
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <Image src="/logo.png" alt="AfriBite Logo" width={180} height={48} className="h-12 w-auto object-contain transition-all duration-300 group-hover:opacity-80" />
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm">
              Your premier destination for authentic African groceries, spices, snacks, and specialty ingredients in Canada. Bringing the taste of home right to your doorstep.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Subscribe to our newsletter
              </h4>
              <div className="flex max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 min-w-0 bg-muted/50 border border-border/50 rounded-l-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-r-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1 group">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Shop Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold mb-6 text-foreground tracking-wide">Shop</h3>
            <ul className="space-y-4">
              {['Catalog', 'Categories', 'Deals', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-muted-foreground text-sm hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold mb-6 text-foreground tracking-wide">Support</h3>
            <ul className="space-y-4">
              {['FAQ', 'Shipping Policy', 'Returns', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.split(' ')[0].toLowerCase()}`} 
                    className="text-muted-foreground text-sm hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold mb-6 text-foreground tracking-wide">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/zEGS7GMnPHH2eMKS9?g_st=iw" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  206 Rue Antoinette-Robidoux<br/>Longueuil, QC J4J 2V3
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+250789284564</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@afribite.com</span>
              </li>
            </ul>
            
            <div className="flex space-x-4 mt-8">
              <a href="#" className="h-10 w-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all duration-300">
                <FacebookIcon className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="h-10 w-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all duration-300">
                <InstagramIcon className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="h-10 w-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all duration-300">
                <TwitterIcon className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} AfriBite Canada. All rights reserved.
          </p>
          
          {/* Payment Badges */}
          <div className="flex items-center flex-wrap justify-center gap-3">
            <span className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium">Secure Checkout</span>
            <div className="flex space-x-2">
              {['STRIPE', 'VISA', 'MASTERCARD', 'AMEX'].map((badge) => (
                <div key={badge} className="bg-background px-3 py-1.5 rounded text-[10px] font-bold text-muted-foreground shadow-sm border border-border flex items-center hover:border-primary/30 transition-colors">
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
