"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Period = "daily" | "weekly" | "monthly" | "all";

const options: { label: string; value: Period }[] = [
  { label: "Hari Ini", value: "daily" },
  { label: "Minggu Ini", value: "weekly" },
  { label: "Bulan Ini", value: "monthly" },
  { label: "Semua", value: "all" },
];

export function PeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("period") ?? "all") as Period;

  function handleClick(value: Period) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("period");
    } else {
      params.set("period", value);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <Tabs value={current} onValueChange={(val) => handleClick(val as Period)}>
      <TabsList className="bg-muted/40 p-1 border h-auto">
        {options.map((opt) => (
          <TabsTrigger 
            key={opt.value} 
            value={opt.value}
            className="px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-700 data-[state=active]:border data-[state=active]:border-amber-200 text-muted-foreground hover:text-foreground rounded-md"
          >
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
