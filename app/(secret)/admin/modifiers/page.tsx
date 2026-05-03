"use server";

import { modifierRepository } from "@/repositories/modifier";
import { ModifierTable } from "./modifier-table";

export default async function ModifiersPage() {
  const modifiers = await modifierRepository.getModifierGroups();
  return (
    <div className="p-6">
      <ModifierTable modifiers={modifiers} />
    </div>
  );
}
