"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/swrConfig";
import { Listing, Pagination } from "@/types";
import { useCart } from "@/context/cartContext";

const Listings = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Listing[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { addToCart } = useCart();

  const { data, error, isLoading } = useApi<Pagination<Listing>>(
    `/listings?status=APPROVED&page=${page}&limit=10`,
    {
      revalidateOnFocus: false,
    }
  );

  // Append data to the list
  useEffect(() => {
    if (data?.data) {
      setItems((prevItems) => [
        ...prevItems,
        ...data.data.filter((newItem) =>
          prevItems.every((oldItem) => oldItem.id !== newItem.id)
        ),
      ]);
      setHasNextPage(data.hasNextPage);
    }
  }, [data]);

  // Trigger loadNextPage when the observer element is visible
  const loadNextPage = () => {
    if (!isLoading && hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadNextPage();
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isLoading]);

  const handleAddToCart = (item: Listing) => {
    addToCart(item);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Product Search</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Seller: {item.seller.name}</p>
              <p>Price: ${item.price}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAddToCart(item)}>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isLoading && <Skeleton className="h-40" />}
      {error && <p>{error.message}</p>}
      <div ref={observerRef} style={{ height: "1px" }} />
    </div>
  );
};

export default Listings;
