'use client'
import { logOut } from "@/app/(auth)/login/action";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function CashierPage() {
  const handleLogout = async () => {
    const res = await logOut();
    if (res.success) {
      toast.success(res.message);
      redirect("/login");
    }
  };

  return (
    <div>
      <Button onClick={handleLogout}></Button>
    </div>
  );
}
