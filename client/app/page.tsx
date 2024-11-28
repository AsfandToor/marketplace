import { Header } from '@/components/header'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Marketplace</h1>
          <p className="text-xl text-muted-foreground mb-6">Your one-stop shop for buying and selling anything</p>
          <Button size="lg">Get Started</Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard 
            title="Buy"
            description="Find great deals on a wide range of products"
          />
          <FeatureCard 
            title="Sell"
            description="List your items and reach thousands of potential buyers"
          />
          <FeatureCard 
            title="Connect"
            description="Build relationships with buyers and sellers in your community"
          />
        </section>
      </main>
      <footer className="bg-muted py-6 text-center">
        <p>&copy; 2023 2Way Marketplace. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  )
}

