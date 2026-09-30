import { getStatusStyle } from "../../utils/statusStyles";

export function StatusBadge({ status, type = "general" }) {
  const isFine = type === "fine";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold shrink-0 ${getStatusStyle(
        status,
        type
      )}`}
    >
      {isFine && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "Sudah Dibayar" ? "bg-emerald-500" : "bg-slate-400"
          }`}
        />
      )}
      {status}
    </span>
  );
}
