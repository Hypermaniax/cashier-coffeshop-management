"use server";

import { modifierRepository } from "@/repositories/modifier";
import { ModifierTable } from "./modifier-table";

export default async function ModifiersPage() {
  const modifiers = await modifierRepository.getModifierGroups();
  return (
    <>
      <ModifierTable modifiers={modifiers} />
    </>
  );
}
