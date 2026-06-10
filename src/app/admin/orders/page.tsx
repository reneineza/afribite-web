import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Search } from 'lucide-react'

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'John Doe', date: '2026-06-10', total: 145.50, status: 'Processing' },
  { id: 'ORD-002', customer: 'Sarah Smith', date: '2026-06-09', total: 89.99, status: 'Shipped' },
  { id: 'ORD-003', customer: 'Michael Johnson', date: '2026-06-08', total: 210.00, status: 'Delivered' },
  { id: 'ORD-004', customer: 'Emily Davis', date: '2026-06-07', total: 45.25, status: 'Cancelled' },
]

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search orders..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ORDERS.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'Delivered' ? 'default' : 
                      order.status === 'Processing' ? 'secondary' : 
                      order.status === 'Cancelled' ? 'destructive' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
