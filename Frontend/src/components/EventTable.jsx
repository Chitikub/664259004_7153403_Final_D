import {
  Search,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  LayoutGrid,
} from "lucide-react";

export default function EventTable({
  events,
  isLoading,
  error,
  keyword,
  categoryFilter,
  categoryOptions,
  onKeywordChange,
  onCategoryChange,
  onSearch,
  onClear,
  onView,
  onEdit,
  onDelete,
  formatDate,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <LayoutGrid className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-wider">
                Overview
              </p>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              รายการกิจกรรม
            </h2>
          </div>
          <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            ทั้งหมด {events.length} รายการ
          </div>
        </div>

        {/* Filter / Search Section */}
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(160px,0.7fr)_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="ค้นหาจากชื่อหรือผู้จัด..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            onClick={onSearch}
          >
            ค้นหา
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            onClick={onClear}
          >
            <RotateCcw className="h-4 w-4" /> ล้าง
          </button>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="mt-8 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-slate-500">
            <Search className="mb-3 h-10 w-10 text-slate-300" />
            <p>ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">ชื่อกิจกรรม</th>
                  <th className="px-4 py-3 font-semibold">ผู้จัด</th>
                  <th className="px-4 py-3 font-semibold">หมวดหมู่</th>
                  <th className="px-4 py-3 font-semibold">วันที่</th>
                  <th className="px-4 py-3 font-semibold">สถานะ</th>
                  <th className="px-4 py-3 text-right font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="transition hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {event.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {event.title}
                    </td>
                    <td className="px-4 py-3">{event.organizer}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(event.eventDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          event.status
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${event.status ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        {event.status ? "เผยแพร่" : "ฉบับร่าง"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => onView(event)}
                          title="ดูรายละเอียด"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
                          onClick={() => onEdit(event)}
                          title="แก้ไข"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          onClick={() => onDelete(event)}
                          title="ลบ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
