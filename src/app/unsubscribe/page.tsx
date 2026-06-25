import { unsubscribe } from "@/app/actions/unsubscribe"

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  if (!email) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Invalid unsubscribe link.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center max-w-md mx-auto p-6 text-center space-y-6">
      <h1 className="text-3xl font-bold text-primary">Unsubscribe</h1>
      <p className="text-muted-foreground text-lg">
        Are you sure you want to unsubscribe <strong>{email}</strong> from the AfriBite newsletter? You will no longer receive our exclusive deals and updates.
      </p>
      
      <form action={unsubscribe} className="w-full mt-8">
        <input type="hidden" name="email" value={email} />
        <button 
          type="submit" 
          className="w-full bg-destructive text-destructive-foreground font-bold py-3 px-4 rounded-md hover:bg-destructive/90 transition-colors"
        >
          Yes, unsubscribe me
        </button>
      </form>
    </div>
  )
}
