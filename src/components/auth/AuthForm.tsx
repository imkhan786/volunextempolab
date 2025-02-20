import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/hooks/useAuth";
import { Mail, Lock } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [userType, setUserType] = useState<
    "individual" | "organization" | "corporate"
  >("individual");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, resetPassword, loading, error } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") {
      await signIn(email, password);
    } else if (mode === "signup") {
      await signUp(email, password, userType);
    } else if (mode === "forgot") {
      const success = await resetPassword(email);
      if (success) {
        toast({
          title: "Reset email sent",
          description: "Check your email for the reset password link",
        });
      }
    }
  };

  return (
    <>
      <Toaster />
      <Card className="w-[400px] bg-white">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            {mode === "signin"
              ? "Sign In"
              : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label>Account Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={userType}
                  onChange={(e) =>
                    setUserType(e.target.value as typeof userType)
                  }
                >
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
            )}
            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Loading..."
                : mode === "signin"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Create Account"
                    : "Reset Password"}
            </Button>
            {mode === "signin" && (
              <Button
                variant="link"
                type="button"
                className="w-full"
                onClick={() => setMode("forgot")}
              >
                Forgot Password?
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {mode === "forgot" ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMode("signin")}
            >
              Back to Sign In
            </Button>
          ) : (
            <>
              <div className="text-sm text-gray-500 text-center">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Create Account" : "Sign In"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
