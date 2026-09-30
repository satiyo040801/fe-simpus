export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(date) {
  if (!date || date === "-") return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function calculateLateDays(dueDate) {
  if (!dueDate || dueDate === "-") return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const difference = today.getTime() - due.getTime();
  if (difference <= 0) return 0;
  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

export function calculateFine(dueDateOrLateDays, finePerDay = 1000) {
  if (typeof dueDateOrLateDays === "number") {
    return dueDateOrLateDays * finePerDay;
  }
  return calculateLateDays(dueDateOrLateDays) * finePerDay;
}
