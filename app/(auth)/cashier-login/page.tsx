"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete, CornerDownLeft } from "lucide-react";
export default function CashierPage() {
  const [pin, setPin] = useState("");

  // Fungsi untuk menambah angka
  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  // Fungsi untuk hapus satu angka (Backspace)
  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  // Fungsi untuk Submit (Enter)
  const handleLogin = () => {
    if (pin.length === 6) {
      console.log("Logging in with PIN:", pin);
      // Panggil API login kamu di sini
    }
  };
  return (
    <Card className="p-5 min-w-md">
      <CardHeader>
        <CardDescription className="text-center text-xs">
          Enter your 6-digit PIN · hint: 123456
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-auto">
        <InputOTP
          maxLength={6}
          value={pin} // <-- Hubungkan ke state pin
          onChange={(newValue) => setPin(newValue)}
          name=""
          readOnly
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-16 w-16 text-2xl font-bold" />
            <InputOTPSlot index={1} className="h-16 w-16 text-2xl font-bold" />
            <InputOTPSlot index={2} className="h-16 w-16 text-2xl font-bold" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="h-16 w-16 text-2xl font-bold" />
            <InputOTPSlot index={4} className="h-16 w-16 text-2xl font-bold" />
            <InputOTPSlot index={5} className="h-16 w-16 text-2xl font-bold" />
          </InputOTPGroup>
        </InputOTP>
      </CardContent>
      <CardContent className="grid grid-cols-3 gap-3 p-0">
        {/* Baris 1-3 (Angka 1-9) */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="secondary"
            className="h-14 text-xl font-semibold border-none"
            onClick={() => handleNumberClick(num.toString())}
          >
            {num}
          </Button>
        ))}

        {/* Baris Terakhir */}
        <Button variant="secondary" className="h-16" onClick={handleBackspace}>
          <Delete className="w-16 h-16" />
        </Button>

        <Button
          variant="secondary"
          className="h-16 text-xl font-semibold "
          onClick={() => handleNumberClick("0")}
        >
          0
        </Button>

        <Button
          className="h-16 bg-orange-500 hover:bg-orange-600 text-black"
          onClick={handleLogin}
          disabled={pin.length !== 6}
        >
          <CornerDownLeft className="w-6 h-6" />
        </Button>
      </CardContent>
    </Card>
  );
}
