"use client";

import { Sidebar } from "@/components/ui/sidebar";
import {
  ShoppingCart,
  Package,
  Trash,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cartContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/swrConfig";
import { Suspense, useState } from "react";

const sidebarItems = [
  { name: "Products", href: "/buyer", icon: Package },
  { name: "My Orders", href: "/buyer/orders", icon: ShoppingCart },
];

async function createOrder<T>(url: string, data: T) {
  await fetcher(url, "POST", data);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cart, removeFromCart, updateCart, deleteCart } = useCart();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createOrderHandler = async () => {
    if (cart.length > 0) {
      setIsLoading(true);
      try {
        await createOrder("/orders", {
          listings: cart.map((item) => ({
            listingId: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
        });
        deleteCart();
      } catch (error) {
        console.error(error);
        setError("An error occurred while creating the order.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Suspense>
      <div className="flex h-screen overflow-hidden">
        <Sidebar items={sidebarItems} title="Marketplace (Buyer)" />
        <main className="relative flex-1 overflow-y-auto p-8">
          <Sheet>
            <SheetTrigger className="absolute right-10 px-2 py-1 rounded hover:bg-black hover:text-white">
              <ShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription>
                  This cart will store all the items you want to buy.
                  {error && <p className="mt-2 text-red-500">{error}</p>}
                </SheetDescription>
                <Separator className="mb-5" />
                {cart.length > 0 ? (
                  <div>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <Card key={item.id}>
                          <CardHeader>
                            <CardTitle>
                              <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                  <p>{item.title}</p>
                                  <p>${item.quantity * item.price}</p>
                                </div>
                                <div className="flex items-center justify-center gap-x-3">
                                  <div className="flex items-center justify-center gap-x-1">
                                    <div
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          updateCart(
                                            item.id,
                                            item.quantity - 1
                                          );
                                        }
                                      }}
                                    >
                                      <MinusCircle size={16} />
                                    </div>
                                    <p>{item.quantity}</p>
                                    <div
                                      onClick={() => {
                                        updateCart(item.id, item.quantity + 1);
                                      }}
                                    >
                                      <PlusCircle size={16} />
                                    </div>
                                  </div>
                                  <Trash
                                    size={18}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      removeFromCart(item.id);
                                    }}
                                  />
                                </div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Button disabled={isLoading} onClick={createOrderHandler}>
                        Create
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </SheetHeader>
            </SheetContent>
          </Sheet>
          {children}
        </main>
      </div>
    </Suspense>
  );
}
