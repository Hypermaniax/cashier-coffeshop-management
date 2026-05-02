"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UserTableProps } from "@/types";
import { useState } from "react";
import EmployeeFormDialog from "./employee-form-dialog";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";

export default function EmployeTable({ users, roles }: UserTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<User | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function handleAdd() {
    setEditEmployee(undefined);
    setFormOpen(!formOpen);
  }
  function openEdit(user: User) {
    setEditEmployee(user);
    setFormOpen(!formOpen);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee</h1>
          <p className="text-muted-foreground">Manage your employee</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>createdAt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No employees found. Click &quot;Add Employee&quot; to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              users.map((users, index) => (
                <TableRow key={index}>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{users.name}</TableCell>
                  <TableCell>{users.username}</TableCell>
                  <TableCell>{users.role.name}</TableCell>
                  <TableCell>{users.createdAt.toDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        users.isActive
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {users.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(users)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({
                            id: users.id,
                            name: users.name,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <EmployeeFormDialog
        open={formOpen}
        onClose={() => setFormOpen(!formOpen)}
        roles={roles}
        employee={editEmployee}
      />
      <DeleteEmployeeDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        employee={deleteTarget}
      />
    </>
  );
}
