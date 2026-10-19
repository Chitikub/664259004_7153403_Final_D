import { PlusCircle, Edit3, Save, XCircle } from "lucide-react";

const categoryOptions = ["อบรม", "สัมมนา", "จิตอาสา"];

export default function EventForm({
  formData,
  mode,
  isSubmitting,
  error,
  successMessage,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";

  // Dynamic Styles base on Mode (เพื่อแยกให้ออกชัดเจนว่ากำลังแก้หรือเพิ่ม)
  const headerColor = isEdit ? "text-amber-600" : "text-blue-600";
  const headerBg = isEdit
    ? "bg-amber-50 border-amber-200"
    : "bg-blue-50 border-blue-200";
  const btnSubmitStyle = isEdit
    ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-200"
    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        {/* Dynamic Mode Header Banner */}
        <div
          className={`mb-6 flex items-start gap-4 rounded-xl border p-4 ${headerBg}`}
        >
          <div className="mt-1 shrink-0">
            {isEdit ? (
              <Edit3 className={`h-6 w-6 ${headerColor}`} />
            ) : (
              <PlusCircle className={`h-6 w-6 ${headerColor}`} />
            )}
          </div>
          <div>
            <h2 className={`text-lg font-bold ${headerColor}`}>
              {isEdit ? "กำลังแก้ไขข้อมูลกิจกรรม" : "สร้างกิจกรรมใหม่"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isEdit
                ? "คุณกำลังแก้ไขข้อมูลของกิจกรรมที่เลือกไว้ โปรดตรวจสอบข้อมูลก่อนบันทึก"
                : "กรอกข้อมูลรายละเอียดด้านล่างเพื่อเพิ่มกิจกรรมเข้าสู่ระบบ"}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              className="mb-1.5 block text-sm font-semibold text-slate-700"
              htmlFor="title"
            >
              ชื่อกิจกรรม
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="เช่น โครงการจิตอาสาเชื่อมชุมชน"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="organizer"
              >
                ผู้จัด
              </label>
              <input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="ระบุชื่อผู้จัด"
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="category"
              >
                หมวดหมู่
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="eventDate"
              >
                วันที่จัด
              </label>
              <input
                id="eventDate"
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="status"
              >
                สถานะการเผยแพร่
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    id="status"
                    type="checkbox"
                    name="status"
                    className="peer sr-only"
                    checked={formData.status}
                    onChange={onChange}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
                <span className="text-sm font-medium text-slate-700">
                  {formData.status ? "เผยแพร่" : "ฉบับร่าง"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-semibold text-slate-700"
              htmlFor="description"
            >
              รายละเอียด
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="4"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="กรอกรายละเอียดกิจกรรมที่นี่..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-100">
              {successMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] focus:ring-4 ${btnSubmitStyle}`}
            >
              <Save className="h-4 w-4" />
              {isSubmitting
                ? "กำลังบันทึก..."
                : isEdit
                  ? "บันทึกการแก้ไข"
                  : "เพิ่มกิจกรรม"}
            </button>

            {/* Show Cancel button distinctly in Edit Mode */}
            {isEdit && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
              >
                <XCircle className="h-4 w-4" />
                ยกเลิกการแก้ไข
              </button>
            )}

            {/* Clear Form in Create Mode */}
            {!isEdit && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                ล้างฟอร์ม
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
