import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Store Details</CardTitle>
            <CardDescription>Manage your store&apos;s public information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="AfriBite Canada" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@afribite.ca" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
            <CardDescription>Manage your Stripe integration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" defaultValue="CAD" disabled />
            </div>
            <Button variant="outline">Connect Stripe Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
