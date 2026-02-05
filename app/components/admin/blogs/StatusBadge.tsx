"use client";

import { Badge } from "../../ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: "blog" | "category";
}

export default function StatusBadge({ status, type = "blog" }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === "blog") {
      return status === "published" ? "default" : "secondary";
    } else {
      return status === "active" ? "default" : "secondary";
    }
  };

  const getColor = () => {
    if (type === "blog") {
      return status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
    } else {
      return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge variant={getVariant()} className={getColor()}>
      {status}
    </Badge>
  );
}