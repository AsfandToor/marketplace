import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-background border-b">
      <Link href="/" className="text-2xl font-bold text-primary">
        Marketplace
      </Link>
      <Button variant="outline" asChild>
        <Link href="/signin">Sign In</Link>
      </Button>
    </header>
  )
}

