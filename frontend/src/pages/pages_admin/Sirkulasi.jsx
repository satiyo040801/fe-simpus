import { useMemo, useState } from "react";
import {
  ArrowUpFromLine,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";
import { PageHeader } from "../../admin/components/common/PageHeader";
import { SearchInput } from "../../admin/components/common/SearchInput";
import Statcard from "../../admin/components/Statcard";
import { BorrowModal } from "../../admin/components/sirkulasi/BorrowModal";
import { ReturnModal } from "../../admin/components/sirkulasi/ReturnModal";
import { CirculationTable } from "../../admin/components/sirkulasi/CirculationTable";
import { useFineSettings } from "../../admin/hooks/useFineSettings";
import { calculateFine, formatRupiah } from "../../admin/utils/formatters";

const initialTransactions = [
  {
    id: 1,
    memberName: "Ahmad Fauzan",
    nis: "20260001",
    bookTitle: "Algoritma dan Pemrograman",
    isbn: "978-602-1234-01-1",
    borrowDate: "2026-09-20",
    dueDate: "2026-09-27",
    returnDate: null,
    status: "Dipinjam",
    extension: 0,
  },
  {
    id: 2,
    memberName: "Siti Rahma",
    nis: "20260002",
    bookTitle: "Bahasa Indonesia",
    isbn: "978-602-1234-03-5",
    borrowDate: "2026-09-15",
    dueDate: "2026-09-22",
    returnDate: null,
    status: "Terlambat",
    extension: 0,
  },
  {
    id: 3,
    memberName: "Budi Santoso",
    nis: "20260003",
    bookTitle: "Matematika Dasar",
    isbn: "978-602-1234-02-8",
    borrowDate: "2026-09-10",
    dueDate: "2026-09-17",
    returnDate: "2026-09-17",
    status: "Dikembalikan",
    extension: 0,
  },
  {
    id: 4,
    memberName: "Nur Aisyah",
    nis: "20260004",
    bookTitle: "Dasar-Dasar Fisika",
    isbn: "978-602-1234-04-2",
    borrowDate: "2026-09-23",
    dueDate: "2026-09-30",
    returnDate: null,
    status: "Dipinjam",
    extension: 0,
  },
];

const members = [
  { nis: "20260001", name: "Ahmad Fauzan" },
  { nis: "20260002", name: "Siti Rahma" },
  { nis: "20260003", name: "Budi Santoso" },
  { nis: "20260004", name: "Nur Aisyah" },
  { nis: "20260005", name: "Rizky Maulana" },
];

const books = [
  { id: 1, title: "Algoritma dan Pemrograman", isbn: "978-602-1234-01-1", available: 5 },
  { id: 2, title: "Matematika Dasar", isbn: "978-602-1234-02-8", available: 2 },
  { id: 3, title: "Bahasa Indonesia", isbn: "978-602-1234-03-5", available: 6 },
  { id: 4, title: "Dasar-Dasar Fisika", isbn: "978-602-1234-04-2", available: 2 },
];

function Sirkulasi() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const finePerDay = useFineSettings();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [borrowForm, setBorrowForm] = useState({
    memberNis: "",
    bookId: "",
    borrowDate: new Date().toISOString().split("T")[0],
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const keyword = search.toLowerCase();
      const searchMatch =
        t.memberName.toLowerCase().includes(keyword) ||
        t.nis.toLowerCase().includes(keyword) ||
        t.bookTitle.toLowerCase().includes(keyword) ||
        t.isbn.toLowerCase().includes(keyword);

      const statusMatch =
        statusFilter === "Semua" || t.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [transactions, search, statusFilter]);

  const activeTransactions = transactions.filter(
    (t) => t.status === "Dipinjam" || t.status === "Terlambat"
  );
  const returnedTransactions = transactions.filter(
    (t) => t.status === "Dikembalikan"
  );
  const lateTransactions = transactions.filter(
    (t) => t.status === "Terlambat"
  );

  const totalFine = lateTransactions.reduce(
    (total, t) => total + calculateFine(t.dueDate, finePerDay),
    0
  );

  const openBorrowModal = () => {
    setBorrowForm({
      memberNis: "",
      bookId: "",
      borrowDate: new Date().toISOString().split("T")[0],
    });
    setShowBorrowModal(true);
  };

  const handleBorrow = (e) => {
    e.preventDefault();
    if (!borrowForm.memberNis || !borrowForm.bookId) {
      alert("Pilih anggota dan buku.");
      return;
    }

    const member = members.find((m) => m.nis === borrowForm.memberNis);
    const book = books.find((b) => String(b.id) === String(borrowForm.bookId));

    if (!member || !book) return;

    const borrowDate = new Date(`${borrowForm.borrowDate}T00:00:00`);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 7);

    const newTransaction = {
      id: Date.now(),
      memberName: member.name,
      nis: member.nis,
      bookTitle: book.title,
      isbn: book.isbn,
      borrowDate: borrowForm.borrowDate,
      dueDate: dueDate.toISOString().split("T")[0],
      returnDate: null,
      status: "Dipinjam",
      extension: 0,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setShowBorrowModal(false);
  };

  const openReturnModal = (t) => {
    setSelectedTransaction(t);
    setShowReturnModal(true);
  };

  const handleReturn = () => {
    if (!selectedTransaction) return;
    const today = new Date().toISOString().split("T")[0];

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTransaction.id
          ? { ...t, returnDate: today, status: "Dikembalikan" }
          : t
      )
    );
    setShowReturnModal(false);
    setSelectedTransaction(null);
  };

  const handleExtend = (t) => {
    if (t.extension >= 1) {
      alert("Transaksi sudah pernah diperpanjang.");
      return;
    }
    const newDue = new Date(`${t.dueDate}T00:00:00`);
    newDue.setDate(newDue.getDate() + 7);

    setTransactions((prev) =>
      prev.map((item) =>
        item.id === t.id
          ? {
              ...item,
              dueDate: newDue.toISOString().split("T")[0],
              extension: 1,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title="Sirkulasi"
        subtitle="Peminjaman dan pengembalian buku."
      >
        <button
          onClick={openBorrowModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={16} />
          Peminjaman Baru
        </button>
      </PageHeader>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Statcard
          title="Dipinjam"
          value={activeTransactions.length}
          icon={ArrowUpFromLine}
          color="blue"
        />
        <Statcard
          title="Terlambat"
          value={lateTransactions.length}
          icon={Clock3}
          color="red"
        />
        <Statcard
          title="Dikembalikan"
          value={returnedTransactions.length}
          icon={CheckCircle2}
          color="emerald"
        />
        <Statcard
          title="Est. Denda"
          value={formatRupiah(totalFine)}
          icon={CalendarDays}
          color="orange"
        />
      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari anggota, NIS, atau judul buku..."
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Dikembalikan">Dikembalikan</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <CirculationTable
        transactions={filteredTransactions}
        finePerDay={finePerDay}
        onExtend={handleExtend}
        onOpenReturn={openReturnModal}
      />

      {/* Modal Peminjaman */}
      <BorrowModal
        open={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        form={borrowForm}
        onChange={(e) =>
          setBorrowForm({ ...borrowForm, [e.target.name]: e.target.value })
        }
        onSubmit={handleBorrow}
        members={members}
        books={books}
      />

      {/* Modal Pengembalian */}
      <ReturnModal
        open={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        transaction={selectedTransaction}
        finePerDay={finePerDay}
        onConfirm={handleReturn}
      />
    </div>
  );
}

export default Sirkulasi;
