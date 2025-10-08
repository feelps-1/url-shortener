"use client";

import { useTransition } from "react";
import { Link as PrismaLink } from "@prisma/client";
import { Switch } from "./ui/switch";
import { toggleLinkStatus } from "@/app/dashboard/actions"; 

interface LinkStatusToggleProps {
  link: PrismaLink;
}

export default function LinkStatusToggle({ link }: LinkStatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleLinkStatus(link.id).then((response) => {
        // Opcional: Adicionar feedback com toasts aqui
        if (response.error) console.error(response.error);
      });
    });
  };

  return (
    <Switch
      checked={link.isActive}
      onCheckedChange={handleToggle}
      disabled={isPending}
      aria-readonly
    />
  );
}