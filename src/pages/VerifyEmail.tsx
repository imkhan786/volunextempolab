import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-[400px] bg-white">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            We've sent you an email with a link to verify your account. Please
            check your inbox and click the link to continue.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
