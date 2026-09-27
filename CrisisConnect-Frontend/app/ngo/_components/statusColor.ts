const COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  OPEN: "bg-green-100 text-green-800",
  APPROVED: "bg-green-100 text-green-800",
  PAID: "bg-green-100 text-green-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  PENDING: "bg-amber-100 text-amber-800",
  CONTAINED: "bg-amber-100 text-amber-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
  CLOSED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
  LOW: "bg-slate-100 text-slate-700",
  RESOLVED: "bg-slate-100 text-slate-700",
  COMPLETED: "bg-slate-100 text-slate-700",
};

export function statusColor(value: string) {
  return COLORS[value] || "bg-slate-100 text-slate-700";
}
