import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6"
import { NewsletterForm } from "@/components/NewsletterForm"

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
                { icon: FaFacebookF, label: 'Facebook' },
                { icon: FaInstagram, label: 'Instagram' },
                { icon: FaTwitter, label: 'Twitter' }
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
