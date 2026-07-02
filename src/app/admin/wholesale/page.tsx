import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { updateWholesaleStatus, deleteWholesaleApplication } from './actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function WholesaleAdminPage() {
  const supabase = await createClient()

  // Fetch all applications
  const { data: applications } = await supabase
    .from('wholesale_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'pending':
      default:
        return <Badge variant="secondary" className="text-yellow-600 bg-yellow-100 hover:bg-yellow-200">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wholesale Applications</h1>
          <p className="text-muted-foreground mt-2">Manage wholesale partnership requests from businesses.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Review and update the status of incoming applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business & Contact</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{app.business_name}</div>
                      <div className="text-sm text-muted-foreground">{app.contact_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{app.email}</div>
                      <div className="text-sm text-muted-foreground">{app.phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Dialog>
                          <DialogTrigger render={<Button variant="outline" size="sm" />}>
                            View Details
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{app.business_name} - Details</DialogTitle>
                              <DialogDescription>
                                Submitted on {new Date(app.created_at).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 my-4">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>Contact:</strong> {app.contact_name}</div>
                                <div><strong>Email:</strong> {app.email}</div>
                                <div><strong>Phone:</strong> {app.phone || 'N/A'}</div>
                                <div><strong>Status:</strong> <span className="capitalize">{app.status}</span></div>
                              </div>
                              <div className="bg-muted p-4 rounded-md">
                                <h4 className="font-bold mb-2">Volume Needs & Details:</h4>
                                <p className="text-sm whitespace-pre-wrap">{app.details}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {app.status === 'pending' && (
                          <>
                            <form action={updateWholesaleStatus.bind(null, app.id, 'approved')}>
                              <Button type="submit" variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </form>
                            <form action={updateWholesaleStatus.bind(null, app.id, 'rejected')}>
                              <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Reject">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </form>
                          </>
                        )}
                        
                        <form action={deleteWholesaleApplication.bind(null, app.id)}>
                          <Button type="submit" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!applications || applications.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No wholesale applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
