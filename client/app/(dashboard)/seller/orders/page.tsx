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
import { Badge } from "@/components/ui/badge";
import { fetcher, useApi } from "@/lib/swrConfig";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Alert } from "@/components/ui/alert";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Order, Pagination } from "@/types";

async function changeOrderStatus(url: string) {
  await fetcher(url, "PATCH");
}

const Page = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useApi<Pagination<Order>>(`/orders/seller?status=${statusFilter}&page=${page}&limit=5`);

  useEffect(() => {
    mutate();
  }, [page, statusFilter]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

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
                    <TableHead>Order ID</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead># of Types</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.data?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.buyer.name}</TableCell>
                      <TableCell>${order.totalPrice}</TableCell>
                      <TableCell>{order.listings.length}</TableCell>
                      <TableCell>
                        {order.status.toLowerCase() === "pending" ? (
                          <Badge className={"text-white bg-gray-500"}>
                            Pending
                          </Badge>
                        ) : order.status.toLowerCase() === "rejected" ? (
                          <Badge className={"text-white bg-red-500"}>
                            Rejected
                          </Badge>
                        ) : (
                          <Badge className={"text-white bg-green-500"}>
                            Approved
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontalIcon size={18} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={async () => {
                                await changeOrderStatus(
                                  `/orders/${order.id}/approve`
                                );
                                mutate();
                              }}
                            >
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={async () => {
                                await changeOrderStatus(
                                  `/orders/${order.id}/reject`
                                );
                                mutate();
                              }}
                            >
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                count={orders?.count || 0}
                page={page}
                limit={5}
                hasNextPage={orders?.hasNextPage || false}
                hasPrevPage={orders?.hasPreviousPage || false}
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
