import {
  Hash,
  User,
  Tag,
  CalendarDays,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function EventDetailCard({ selectedEvent, formatDate }) {
  if (!selectedEvent) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white p-6 shadow-sm sm:p-8 animate-fade-in mt-6 xl:mt-0">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-900">รายละเอียดกิจกรรม</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
            selectedEvent.status
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {selectedEvent.status ? "เผยแพร่" : "ฉบับร่าง"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <Hash className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              รหัสกิจกรรม
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              #{selectedEvent.id}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:col-span-2">
          <FileText className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              ชื่อกิจกรรม
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {selectedEvent.title}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <User className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              ผู้จัด
            </p>
            <p className="mt-1 font-medium text-slate-900">
              {selectedEvent.organizer}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <Tag className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              หมวดหมู่
            </p>
            <p className="mt-1 font-medium text-slate-900">
              {selectedEvent.category}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:col-span-2">
          <CalendarDays className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              วันที่จัด
            </p>
            <p className="mt-1 font-medium text-slate-900">
              {formatDate(selectedEvent.eventDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-slate-900">รายละเอียดเพิ่มเติม</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {selectedEvent.description || "ไม่มีรายละเอียดเพิ่มเติม"}
        </p>
      </div>
    </div>
  );
}
