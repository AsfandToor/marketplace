"use client";

import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/swrConfig";
import { OrderMetrics } from "@/types";

export default function Dashboard() {
  const {
    data: metrics,
    error,
    isLoading,
  } = useApi<OrderMetrics>("/orders/metrics", {
    // Refresh every 1 minute
    refreshInterval: 60000,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {error && <Alert variant="destructive">{error.message}</Alert>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isLoading ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>
                  Your sales for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${metrics?.totalOrdersAmount || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rejected Orders</CardTitle>
                <CardDescription>
                  Orders waiting to be processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metrics?.totalRejectedOrders} / {metrics?.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Approved Orders</CardTitle>
                <CardDescription>Average rating from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{ metrics?.totalApprovedOrders } / {metrics?.totalOrders}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        )}
      </div>
    </div>
  );
}
