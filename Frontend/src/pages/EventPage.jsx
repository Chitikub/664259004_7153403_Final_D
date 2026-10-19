import { useEffect, useMemo, useState } from "react";
import EventForm from "../components/EventForm";
import EventTable from "../components/EventTable";
import EventDetailCard from "../components/EventDetailCard";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../services/eventService";

const categoryOptions = ["อบรม", "สัมมนา", "จิตอาสา"];

const emptyForm = {
  title: "",
  organizer: "",
  category: "อบรม",
  eventDate: "",
  description: "",
  status: true,
};

const hydrateForm = (event) => ({
  id: event.id,
  title: event.title || "",
  organizer: event.organizer || "",
  category: event.category || "อบรม",
  eventDate: event.eventDate
    ? new Date(`${event.eventDate}T00:00:00`).toISOString().slice(0, 10)
    : "",
  description: event.description || "",
  status: event.status !== undefined ? Boolean(event.status) : true,
});

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [mode, setMode] = useState("create");
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadEvents = async (filters = {}) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await getEvents({
        q: filters.q ?? searchTerm,
        category: filters.category ?? categoryFilter,
      });
      setEvents(result);
      if (
        selectedEvent &&
        !result.some((event) => event.id === selectedEvent.id)
      ) {
        setSelectedEvent(null);
      }
    } catch (loadError) {
      setError(loadError.message || "ไม่สามารถโหลดข้อมูลได้");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const breadcrumbSummary = useMemo(
    () => ` ${events.length} รายการ `,
    [events.length],
  );

  const resetForm = () => {
    setFormData(emptyForm);
    setMode("create");
  };

  const validateForm = () => {
    const title = formData.title.trim();
    const organizer = formData.organizer.trim();
    const description = formData.description.trim();

    if (!title || title.length > 150) {
      return "ชื่อกิจกรรมต้องมีความยาว 1-150 ตัวอักษร";
    }
    if (!organizer || organizer.length > 100) {
      return "ผู้จัดต้องมีความยาว 1-100 ตัวอักษร";
    }
    if (!categoryOptions.includes(formData.category)) {
      return "กรุณาเลือกหมวดหมู่ที่ถูกต้อง";
    }
    if (
      !formData.eventDate ||
      Number.isNaN(new Date(`${formData.eventDate}T00:00:00`).getTime())
    ) {
      return "กรุณาเลือกวันที่จัดกิจกรรมให้ถูกต้อง";
    }
    if (!description || description.length > 2000) {
      return "รายละเอียดต้องมีความยาว 1-2000 ตัวอักษร";
    }
    return "";
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        organizer: formData.organizer.trim(),
        category: formData.category,
        eventDate: formData.eventDate,
        description: formData.description.trim(),
        status: Boolean(formData.status),
      };

      if (mode === "edit" && formData.id) {
        await updateEvent(formData.id, payload);
        setSuccessMessage("แก้ไขข้อมูลสำเร็จ");
      } else {
        await createEvent(payload);
        setSuccessMessage("เพิ่มข้อมูลสำเร็จ");
      }

      await loadEvents();
      resetForm();
    } catch (submitError) {
      setError(submitError.message || "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (eventItem) => {
    setSelectedEvent(eventItem);
    setError("");
  };

  const handleEdit = (eventItem) => {
    setSelectedEvent(eventItem);
    setFormData(hydrateForm(eventItem));
    setMode("edit");
    setError("");
    setSuccessMessage("");
  };

  const handleDelete = async (eventItem) => {
    const confirmed = window.confirm(
      `ยืนยันลบกิจกรรม "${eventItem.title}" หรือไม่`,
    );
    if (!confirmed) return;

    try {
      await deleteEvent(eventItem.id);
      setSuccessMessage("ลบข้อมูลสำเร็จ");
      if (selectedEvent?.id === eventItem.id) setSelectedEvent(null);
      if (mode === "edit" && formData.id === eventItem.id) resetForm();
      await loadEvents();
    } catch (deleteError) {
      setError(deleteError.message || "ลบข้อมูลไม่สำเร็จ");
    }
  };

  const handleSearch = async () => {
    setSearchTerm(keyword);
    await loadEvents({ q: keyword, category: categoryFilter });
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleClear = async () => {
    setKeyword("");
    setSearchTerm("");
    setCategoryFilter("");
    await loadEvents({ q: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-xl shadow-sky-100/40 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                ระบบจัดการกิจกรรม
              </h1>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 shadow-sm">
              {breadcrumbSummary}
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <EventTable
              events={events}
              isLoading={isLoading}
              error={error}
              keyword={keyword}
              categoryFilter={categoryFilter}
              categoryOptions={categoryOptions}
              onKeywordChange={setKeyword}
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
              onClear={handleClear}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatDate={formatDate}
            />

            <EventDetailCard
              selectedEvent={selectedEvent}
              formatDate={formatDate}
            />
          </section>

          <aside className="space-y-6">
            <EventForm
              formData={formData}
              mode={mode}
              isSubmitting={isSubmitting}
              error={error}
              successMessage={successMessage}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
