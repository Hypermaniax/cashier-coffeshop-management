"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
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
import { cn } from "@/lib/utils";

export default function EmployeTable({ users, roles }: UserTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<User | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  function handleAdd() {
    setEditEmployee(undefined);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setEditEmployee(user);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setEditEmployee(undefined);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            Karyawan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akun karyawan dan hak akses mereka.
          </p>
        </div>
        <Button
          id="btn-tambah-employee"
          onClick={handleAdd}
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Karyawan
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12 font-semibold">No</TableHead>
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="font-semibold">Username</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Dibuat</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-center w-28 font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8 opacity-30" />
                    <p className="font-medium">Belum ada karyawan</p>
                    <p className="text-xs">Klik &quot;Tambah Karyawan&quot; untuk memulai.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.username}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {user.role.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold",
                        user.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-600"
                      )}
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1 ">
                      <Button
                        id={`btn-edit-employee-${user.id}`}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-amber-50"
                        onClick={() => openEdit(user)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-amber-600" />
                      </Button>
                      <Button
                        id={`btn-delete-employee-${user.id}`}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-red-50"
                        onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
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
        onClose={handleFormClose}
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
