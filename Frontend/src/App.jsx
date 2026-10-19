import { useEffect, useState } from "react";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "./services/eventService";

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

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [mode, setMode] = useState("create");
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setFormData(emptyForm);
    setMode("create");
  };

  const fetchEvents = async (overrideFilters = {}) => {
    setIsLoading(true);
    setError("");

    try {
      const filters = {
        q: overrideFilters.q ?? keyword,
        category: overrideFilters.category ?? categoryFilter,
      };
      const results = await getEvents(filters);
      setEvents(results);
      if (
        selectedEvent &&
        !results.some((event) => event.id === selectedEvent.id)
      ) {
        setSelectedEvent(null);
      }
    } catch (fetchError) {
      setError(fetchError.message || "ไม่สามารถเรียกข้อมูลได้");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [keyword, categoryFilter]);

  const validateForm = () => {
    const title = formData.title.trim();
    const organizer = formData.organizer.trim();
    const description = formData.description.trim();

    if (!title || title.length > 150)
      return "ชื่อกิจกรรมต้องมีความยาว 1-150 ตัวอักษร";
    if (!organizer || organizer.length > 100)
      return "ผู้จัดต้องมีความยาว 1-100 ตัวอักษร";
    if (!categoryOptions.includes(formData.category))
      return "กรุณาเลือกหมวดหมู่ที่ถูกต้อง";
    if (
      !formData.eventDate ||
      Number.isNaN(new Date(`${formData.eventDate}T00:00:00`).getTime())
    ) {
      return "กรุณาเลือกวันที่จัดกิจกรรมให้ถูกต้อง";
    }
    if (!description || description.length > 2000)
      return "รายละเอียดต้องมีความยาว 1-2000 ตัวอักษร";

    return "";
  };

  const handleChange = (event) => {
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

      await fetchEvents();
      resetForm();
    } catch (submitError) {
      setError(submitError.message || "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectEvent = async (eventItem) => {
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
      await fetchEvents();
    } catch (deleteError) {
      setError(deleteError.message || "ลบข้อมูลไม่สำเร็จ");
    }
  };

  const handleSearch = async () => {
    await fetchEvents();
  };

  const clearFilters = () => {
    setKeyword("");
    setCategoryFilter("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ข้อสอบปลายภาค 7153403</p>
          <h1>ระบบจัดการกิจกรรม</h1>
        </div>
      </header>

      <div className="content-grid">
        <section className="panel form-panel">
          <div className="panel-header">
            <h2>
              {mode === "edit" ? "แก้ไขข้อมูลกิจกรรม" : "เพิ่มข้อมูลกิจกรรม"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="event-form">
            <div className="field-group">
              <label htmlFor="title">ชื่อกิจกรรม</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="เช่น โครงการจิตอาสาเชื่อมชุมชน"
              />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="organizer">ผู้จัด</label>
                <input
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="ระบุชื่อผู้จัด"
                />
              </div>

              <div className="field-group">
                <label htmlFor="category">หมวดหมู่</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="eventDate">วันที่จัด</label>
                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group checkbox-group">
                <label htmlFor="status">สถานะ</label>
                <label className="switch">
                  <input
                    id="status"
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <span>{formData.status ? "เผยแพร่" : "ฉบับร่าง"}</span>
                </label>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="description">รายละเอียด</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="กรอกรายละเอียดกิจกรรม"
              />
            </div>

            {error && <div className="alert error">{error}</div>}
            {successMessage && (
              <div className="alert success">{successMessage}</div>
            )}

            <div className="action-row">
              <button
                type="submit"
                className="primary-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "กำลังบันทึก..."
                  : mode === "edit"
                    ? "บันทึกการแก้ไข"
                    : "เพิ่มกิจกรรม"}
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-header">
            <h2>รายการกิจกรรม</h2>
          </div>

          <div className="toolbar">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ค้นหาจากชื่อหรือผู้จัด"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
              className="secondary-btn"
              onClick={handleSearch}
            >
              ค้นหา
            </button>
            <button type="button" className="ghost-btn" onClick={clearFilters}>
              ล้าง
            </button>
          </div>

          {isLoading ? (
            <div className="status-box loading">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="status-box error">{error}</div>
          ) : events.length === 0 ? (
            <div className="status-box empty">
              ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ชื่อกิจกรรม</th>
                    <th>ผู้จัด</th>
                    <th>หมวดหมู่</th>
                    <th>วันที่</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.id}</td>
                      <td>{event.title}</td>
                      <td>{event.organizer}</td>
                      <td>{event.category}</td>
                      <td>{formatDate(event.eventDate)}</td>
                      <td>
                        <span
                          className={`status-pill ${event.status ? "published" : "draft"}`}
                        >
                          {event.status ? "เผยแพร่" : "ฉบับร่าง"}
                        </span>
                      </td>
                      <td className="action-cell">
                        <button
                          type="button"
                          className="table-btn view-btn"
                          onClick={() => handleSelectEvent(event)}
                        >
                          ดู
                        </button>
                        <button
                          type="button"
                          className="table-btn edit-btn"
                          onClick={() => handleEdit(event)}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          className="table-btn delete-btn"
                          onClick={() => handleDelete(event)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedEvent && (
        <section className="panel detail-panel">
          <div className="panel-header">
            <h2>รายละเอียดกิจกรรม</h2>
          </div>
          <div className="detail-grid">
            <div>
              <span>รหัส</span>
              <strong>#{selectedEvent.id}</strong>
            </div>
            <div>
              <span>ชื่อกิจกรรม</span>
              <strong>{selectedEvent.title}</strong>
            </div>
            <div>
              <span>ผู้จัด</span>
              <strong>{selectedEvent.organizer}</strong>
            </div>
            <div>
              <span>หมวดหมู่</span>
              <strong>{selectedEvent.category}</strong>
            </div>
            <div>
              <span>วันที่จัด</span>
              <strong>{formatDate(selectedEvent.eventDate)}</strong>
            </div>
            <div>
              <span>สถานะ</span>
              <strong>{selectedEvent.status ? "เผยแพร่" : "ฉบับร่าง"}</strong>
            </div>
            <div className="full-width">
              <span>รายละเอียด</span>
              <strong>{selectedEvent.description}</strong>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
