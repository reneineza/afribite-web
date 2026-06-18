"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContactMessage {
  id: string;
  subject: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface WholesaleApplication {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
  details: string;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [wholesale, setWholesale] = useState<WholesaleApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const [contactsRes, wholesaleRes] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('wholesale_applications').select('*').order('created_at', { ascending: false })
      ])

      if (contactsRes.data) setContacts(contactsRes.data)
      if (wholesaleRes.data) setWholesale(wholesaleRes.data)
      
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) return <div className="p-8">Loading messages...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages & Inquiries</h1>

      <Tabs defaultValue="contact">
        <TabsList className="mb-6">
          <TabsTrigger value="contact">Contact Forms ({contacts.length})</TabsTrigger>
          <TabsTrigger value="wholesale">Wholesale Applications ({wholesale.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          {contacts.length === 0 ? <p>No contact messages yet.</p> : contacts.map(msg => (
            <Card key={msg.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>{msg.subject}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium mb-2">From: {msg.name} ({msg.email})</div>
                <p className="text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="wholesale" className="space-y-4">
          {wholesale.length === 0 ? <p>No wholesale applications yet.</p> : wholesale.map(app => (
            <Card key={app.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>{app.business_name}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div><strong>Contact:</strong> {app.contact_name}</div>
                  <div><strong>Email:</strong> {app.email}</div>
                  <div><strong>Phone:</strong> {app.phone || 'N/A'}</div>
                  <div><strong>Status:</strong> <span className="capitalize">{app.status}</span></div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium mb-1">Details/Volume Needs:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
