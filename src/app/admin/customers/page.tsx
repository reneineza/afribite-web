import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const MOCK_CUSTOMERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', orders: 12, spent: 1450.50 },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', orders: 3, spent: 289.99 },
  { id: '3', name: 'Michael Johnson', email: 'michael@example.com', orders: 8, spent: 910.00 },
]

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Customer Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search customers..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CUSTOMERS.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-right">{customer.orders}</TableCell>
                  <TableCell className="text-right">${customer.spent.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
