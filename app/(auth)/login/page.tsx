"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Loader2, Lock, LogIn, User } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { login } from "./action";

export default function AdminPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (!state) return;
    if (state?.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <Card className="p-5 min-w-md">
      <CardHeader>
        <CardDescription className="text-center text-xs">Login</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <InputGroup className="px-4 py-5">
            <InputGroupText>
              <User className="w-6 h-6" />
            </InputGroupText>
            <InputGroupInput
              name="username"
              disabled={isPending}
              defaultValue={state?.inputs?.username}
              required
              placeholder="Username"
            />
          </InputGroup>
          <InputGroup className="px-4 py-5w">
            <InputGroupText>
              <Lock className="w-6 h-6" />
            </InputGroupText>
            <InputGroupInput
              type="password"
              name="password"
              disabled={isPending}
              defaultValue={state?.inputs?.password}
              required
              placeholder="Password"
            />
          </InputGroup>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full p-4 text-lg "
          >
            {isPending ? <Spinner className="animate-spin" /> : "Login"}{" "}
            <LogIn />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
