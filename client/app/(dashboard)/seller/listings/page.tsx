"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetcher, useApi } from "@/lib/swrConfig";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TablePagination from "@/components/ui/table-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Listing, Pagination } from "@/types";

async function createListing<T>(url: string, data: T) {
  await fetcher(url, "POST", data);
}

const LISTING_DATA = {
    title: "",
    price: 0,
    description: "",
}

const Page = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listingData, setListingData] = useState(LISTING_DATA);
  const [createListingError, setCreateListingError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const {
    data: listings,
    error,
    isLoading,
    mutate,
  } = useApi<Pagination<Listing>>(`/listings/seller?status=${statusFilter}&page=${page}&limit=5`);

  useEffect(() => {
    mutate();
  }, [page, statusFilter]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createListing("/listings", listingData);
      setListingData(LISTING_DATA);
      mutate();
    } catch (error) {
      console.error(error);
      setCreateListingError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Listings</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create Listing</DialogTitle>
            <form onSubmit={handleSubmit}>
              {createListingError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{createListingError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Title</Label>
                  <Input
                    id="title"
                    type="title"
                    value={listingData.title}
                    onChange={(e) => setListingData({ ...listingData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Price</Label>
                  <Input
                    id="password"
                    type="number"
                    value={listingData.price}
                    onChange={(e) => setListingData({ ...listingData, price: +e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={listingData.description}
                    onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-3"
                disabled={isSubmitting}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <Table>
                <TableHeader>
                  {error && (
                    <Alert variant="destructive">{error.message}</Alert>
                  )}
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings?.data?.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>{listing.title}</TableCell>
                      <TableCell>{listing.seller.name}</TableCell>
                      <TableCell>${listing.price}</TableCell>
                      <TableCell>
                        {listing.status.toLowerCase() === "pending" ? (
                          <Badge className={"text-white bg-gray-500"}>
                            Pending
                          </Badge>
                        ) : (
                          <Badge className={"text-white bg-green-500"}>
                            Approved
                          </Badge>
                        )}
                      </TableCell>   
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                count={listings?.count || 0}
                page={page}
                limit={5}
                hasNextPage={listings?.hasNextPage || false}
                hasPrevPage={listings?.hasPreviousPage || false}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
