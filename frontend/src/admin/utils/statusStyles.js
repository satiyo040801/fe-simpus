export function getStatusStyle(status, type = "general") {
  if (type === "book") {
    if (status === "Tersedia") return "bg-emerald-50 text-emerald-700";
    if (status === "Dipinjam") return "bg-blue-50 text-blue-700";
    if (status === "Rusak") return "bg-orange-50 text-orange-700";
    return "bg-red-50 text-red-700";
  }

  if (type === "member") {
    if (status === "Aktif") return "bg-emerald-50 text-emerald-700";
    return "bg-slate-100 text-slate-600";
  }

  if (type === "loan") {
    if (status === "Dipinjam") return "bg-blue-50 text-blue-700";
    if (status === "Terlambat") return "bg-red-50 text-red-700";
    return "bg-emerald-50 text-emerald-700";
  }

  if (type === "fine") {
    if (status === "Sudah Dibayar") return "bg-emerald-50 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  }

  if (status === "Aktif" || status === "Tersedia" || status === "Dikembalikan" || status === "Sudah Dibayar") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "Dipinjam") return "bg-blue-50 text-blue-700";
  if (status === "Terlambat" || status === "Hilang") return "bg-red-50 text-red-700";
  if (status === "Rusak") return "bg-orange-50 text-orange-700";

  return "bg-slate-100 text-slate-600";
}
