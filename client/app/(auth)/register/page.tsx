"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSession, signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from "@/components/ui/select";
import { fetcher } from "@/lib/swrConfig";

async function createUser<T>(url: string, data: T) {
    await fetcher(url, "POST", data);
  }

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
        await createUser("/auth/register", {
            name: name,
            email: email,
            password: password,
            role: role,
        });
    } catch (error) {
        setError("Cannot create user at this moment.");
        console.log(error);
    }

    try {
      const response = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (response?.status === 401) {
        setError("Invalid email or password");
        return;
      }

      if (!response?.ok) {
        throw new Error("Failed to login");
      }

      if (response.ok) {
        const session = await getSession();
        if (session?.user?.role.toLowerCase() === "buyer") {
          console.log("buyer");
          router.push("/buyer");
        } else if (session?.user?.role.toLowerCase() === "seller") {
          router.push("/seller");
        } else if (session?.user?.role.toLowerCase() === "approver") {
          router.push("/approver");
        } else {
          router.push("/signin");
        }
      }
    } catch (error) {
        router.push("/signin");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md min-h-screen mx-auto flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your credentials to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Role</Label>
                <Select value={role} onValueChange={setRole} defaultValue="BUYER" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUYER">Buyer</SelectItem>
                    <SelectItem value="APPROVER">Approver</SelectItem>
                    <SelectItem value="SELLER">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full mt-3" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
