import Link from "next/link"

export default function UnsubscribeSuccessPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center max-w-md mx-auto p-6 text-center space-y-6">
      <h1 className="text-3xl font-bold text-primary">Unsubscribed</h1>
      <p className="text-muted-foreground text-lg">
        You have been successfully removed from our mailing list. We&apos;re sorry to see you go!
      </p>
      
      <Link href="/" className="text-secondary font-bold hover:underline mt-4">
        Return to Homepage
      </Link>
    </div>
  )
}
