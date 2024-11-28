import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-background border-b">
      <Link href="/" className="text-2xl font-bold text-primary">
        Marketplace
      </Link>
      <div className='space-x-2'>
        <Button variant="outline" asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </header>
  )
}

