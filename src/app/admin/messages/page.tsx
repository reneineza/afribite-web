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



export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const [contactsRes] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      ])

      if (contactsRes.data) setContacts(contactsRes.data)
      
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


      </Tabs>
    </div>
  )
}
