"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PaymentMethod = "CASH" | "QRIS" | "DEBIT" | "all";

const options: { label: string; value: PaymentMethod }[] = [
  { label: "Tunai", value: "CASH" },
  { label: "QRIS", value: "QRIS" },
  { label: "Debit", value: "DEBIT" },
  { label: "Semua", value: "all" },
];

export function PaymentFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("payment-method") ??
    "all") as PaymentMethod;

  function handleClick(value: PaymentMethod) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("payment-method");
    } else {
      params.set("payment-method", value);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <Tabs value={current}>
      <TabsList className="bg-muted/40 p-1 border h-auto">
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            onClick={() => handleClick(option.value)}
            className="px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-700 data-[state=active]:border data-[state=active]:border-amber-200 text-muted-foreground hover:text-foreground rounded-md"
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
