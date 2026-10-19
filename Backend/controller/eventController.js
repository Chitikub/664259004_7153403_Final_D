import { Op } from "sequelize";
import Event, { VALID_EVENT_CATEGORIES } from "../model/Event.js";

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

const isValidDate = (value) => {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

const validateEventPayload = (payload, { allowId = false } = {}) => {
  if (!payload || typeof payload !== "object") {
    return "Request body is required.";
  }

  if (allowId) {
    const id = Number(payload.id);
    if (!Number.isInteger(id) || id <= 0) {
      return "ID must be a positive integer.";
    }
  }

  const title = normalizeString(payload.title);
  if (typeof title !== "string" || title.length < 1 || title.length > 150) {
    return "Title must be between 1 and 150 characters.";
  }

  const organizer = normalizeString(payload.organizer);
  if (
    typeof organizer !== "string" ||
    organizer.length < 1 ||
    organizer.length > 100
  ) {
    return "Organizer must be between 1 and 100 characters.";
  }

  const category = normalizeString(payload.category);
  if (!VALID_EVENT_CATEGORIES.includes(category)) {
    return `Category must be one of: ${VALID_EVENT_CATEGORIES.join(", ")}`;
  }

  const eventDate = normalizeString(payload.eventDate);
  if (!isValidDate(eventDate)) {
    return "Event date must be a valid date in YYYY-MM-DD format.";
  }

  const description = normalizeString(payload.description);
  if (
    typeof description !== "string" ||
    description.length < 1 ||
    description.length > 2000
  ) {
    return "Description must be between 1 and 2000 characters.";
  }

  if (payload.status !== undefined && typeof payload.status !== "boolean") {
    return "Status must be a boolean value.";
  }

  return null;
};

const buildWhereClause = (query, category) => {
  const where = {};
  const searchTerm = normalizeString(query);
  const categoryFilter = normalizeString(category);

  if (searchTerm) {
    where[Op.or] = [
      { title: { [Op.like]: `%${searchTerm}%` } },
      { organizer: { [Op.like]: `%${searchTerm}%` } },
      { description: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  if (categoryFilter) {
    where.category = categoryFilter;
  }

  return where;
};

export const getAllEvents = async (req, res) => {
  try {
    const { q = "", category = "" } = req.query;
    const where = buildWhereClause(q, category);

    const events = await Event.findAll({
      where,
      order: [["id", "ASC"]],
    });

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load events." });
  }
};

export const getEventById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID must be a positive integer." });
  }

  try {
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load event details." });
  }
};

export const createEvent = async (req, res) => {
  const validationError = validateEventPayload(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const event = await Event.create({
      title: normalizeString(req.body.title),
      organizer: normalizeString(req.body.organizer),
      category: normalizeString(req.body.category),
      eventDate: normalizeString(req.body.eventDate),
      description: normalizeString(req.body.description),
      status: req.body.status !== undefined ? Boolean(req.body.status) : true,
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event." });
  }
};

export const updateEvent = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID must be a positive integer." });
  }

  const validationError = validateEventPayload(
    { ...req.body, id },
    { allowId: true },
  );
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingEvent = await Event.findByPk(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    const updatedEvent = await existingEvent.update({
      title: normalizeString(req.body.title),
      organizer: normalizeString(req.body.organizer),
      category: normalizeString(req.body.category),
      eventDate: normalizeString(req.body.eventDate),
      description: normalizeString(req.body.description),
      status: Boolean(req.body.status),
    });

    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update event." });
  }
};

export const deleteEvent = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID must be a positive integer." });
  }

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    await event.destroy();
    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event." });
  }
};
