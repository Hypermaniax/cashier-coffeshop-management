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
import { Lock, LogIn, User } from "lucide-react";

export default function AdminPage() {
  return (
    <Card className="p-5 min-w-md">
      <CardHeader>
        <CardDescription className="text-center text-xs">Admin</CardDescription>
      </CardHeader>
      <CardContent >
        <form className="flex flex-col gap-5">
          <InputGroup className="px-4 py-5">
            <InputGroupText>
              <User className="w-6 h-6" />
            </InputGroupText>
            <InputGroupInput required placeholder="Username" />
          </InputGroup>
          <InputGroup className="px-4 py-5w">
            <InputGroupText>
              <Lock className="w-6 h-6" />
            </InputGroupText>
            <InputGroupInput type="password" required placeholder="Password" />
          </InputGroup>
          <Button className="w-full p-4 text-lg ">
            Login <LogIn />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
