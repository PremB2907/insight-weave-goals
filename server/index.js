import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");
const JWT_SECRET = process.env.JWT_SECRET || "paradigm-secret-development";
const PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${PORT}`;

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const readDB = async () => {
  try {
    const text = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(text);
    const users = await Promise.all(
      db.users.map(async (user) => {
        if (user.password && !user.passwordHash) {
          const hash = await bcrypt.hash(user.password, 10);
          return { ...user, passwordHash: hash, password: undefined };
        }
        return user;
      }),
    );
    const normalized = { ...db, users };
    await fs.writeFile(DB_PATH, JSON.stringify(normalized, null, 2));
    return normalized;
  } catch (error) {
    const initial = {
      users: [],
      habits: [],
      goals: [],
      journalEntries: [],
      notes: [],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
};

const writeDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
};

const getToday = () => new Date().toISOString().slice(0, 10);

const addDays = (dateString, offset) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const isNextDay = (prev, next) => {
  const nextDay = new Date(prev);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().slice(0, 10) === next;
};

const computeStreaks = (checkIns, frequency) => {
  const sorted = Array.from(new Set(checkIns)).sort();
  let currentStreak = 0;
  let longestStreak = 0;

  if (frequency === "daily") {
    const daySet = new Set(sorted);
    let cursor = getToday();
    while (daySet.has(cursor)) {
      currentStreak += 1;
      cursor = addDays(cursor, -1);
    }

    let streak = 0;
    sorted.forEach((date, index) => {
      if (index === 0 || !isNextDay(sorted[index - 1], date)) {
        streak = 1;
      } else {
        streak += 1;
      }
      longestStreak = Math.max(longestStreak, streak);
    });
  } else {
    const weekKeys = sorted
      .map((date) => {
        const d = new Date(date);
        const year = d.getUTCFullYear();
        const first = new Date(Date.UTC(year, 0, 1));
        const day = Math.floor((d.getTime() - first.getTime()) / 86400000) + 1;
        return `${year}-W${Math.ceil(day / 7)}`;
      })
      .filter((v, i, arr) => arr.indexOf(v) === i);

    let cursor = weekKeys[weekKeys.length - 1];
    while (cursor && weekKeys.includes(cursor)) {
      currentStreak += 1;
      const [yearStr, weekStr] = cursor.split("-W");
      const year = Number(yearStr);
      const week = Number(weekStr) - 1;
      const first = new Date(Date.UTC(year, 0, 1));
      first.setDate(first.getDate() + week * 7);
      const nextDate = first.toISOString().slice(0, 10);
      cursor = `${year}-W${Math.ceil((new Date(nextDate).getUTCDate() + 1) / 7)}`;
      break;
    }

    longestStreak = weekKeys.length;
  }

  return { currentStreak, longestStreak };
};

const createToken = (user) => jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = await readDB();
    const user = db.users.find((item) => item.id === payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email and password are required" });
  }
  const db = await readDB();
  const exists = db.users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: "User already exists" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: `u-${Date.now()}`,
    username,
    email,
    passwordHash,
    avatar: username.charAt(0).toUpperCase(),
  };
  db.users.unshift(newUser);
  await writeDB(db);
  const token = createToken(newUser);
  res.json({ user: { id: newUser.id, username: newUser.username, email: newUser.email, avatar: newUser.avatar }, token });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const db = await readDB();
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = createToken(user);
  res.json({ user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }, token });
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({ user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } });
});

app.get("/api/notes", authMiddleware, async (req, res) => {
  const db = await readDB();
  const notes = db.notes.filter((note) => note.ownerId === req.user.id || note.collaborators.includes(req.user.id));
  res.json({ notes });
});

app.get("/api/notes/share/:token", async (req, res) => {
  const db = await readDB();
  const note = db.notes.find((noteItem) => noteItem.shareToken === req.params.token);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json({ note });
});

app.post("/api/notes", authMiddleware, async (req, res) => {
  const db = await readDB();
  const { title } = req.body;
  const note = {
    id: `n-${Date.now()}`,
    title: title?.trim() || "Untitled Note",
    content: "",
    ownerId: req.user.id,
    collaborators: [],
    shareToken: `share-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    shareMode: "edit",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.notes.unshift(note);
  await writeDB(db);
  res.json({ note });
});

app.patch("/api/notes/:id", authMiddleware, async (req, res) => {
  const db = await readDB();
  const note = db.notes.find((noteItem) => noteItem.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  if (note.ownerId !== req.user.id && !note.collaborators.includes(req.user.id)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  note.title = req.body.title ?? note.title;
  note.content = req.body.content ?? note.content;
  note.updatedAt = new Date().toISOString();
  await writeDB(db);
  res.json({ note });
});

app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  const db = await readDB();
  const noteIndex = db.notes.findIndex((noteItem) => noteItem.id === req.params.id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  const note = db.notes[noteIndex];
  if (note.ownerId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.notes.splice(noteIndex, 1);
  await writeDB(db);
  res.json({ success: true });
});

app.get("/api/habits", authMiddleware, async (req, res) => {
  const db = await readDB();
  const habits = db.habits.filter((habit) => habit.userId === req.user.id);
  res.json({ habits });
});

app.post("/api/habits", authMiddleware, async (req, res) => {
  const db = await readDB();
  const { name, frequency = "daily", reminderTime } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Habit name is required" });
  }
  const habit = {
    id: `h-${Date.now()}`,
    userId: req.user.id,
    name,
    frequency,
    reminderTime,
    checkIns: [],
    streak: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedToday: false,
    progress: 0,
  };
  db.habits.unshift(habit);
  await writeDB(db);
  res.json({ habit });
});

app.patch("/api/habits/:id/checkin", authMiddleware, async (req, res) => {
  const db = await readDB();
  const habit = db.habits.find((habitItem) => habitItem.id === req.params.id && habitItem.userId === req.user.id);
  if (!habit) {
    return res.status(404).json({ error: "Habit not found" });
  }
  const today = getToday();
  const already = habit.checkIns.includes(today);
  if (!already) {
    habit.checkIns.push(today);
  }
  const { currentStreak, longestStreak } = computeStreaks(habit.checkIns, habit.frequency);
  habit.currentStreak = currentStreak;
  habit.longestStreak = Math.max(longestStreak, habit.longestStreak);
  habit.streak = currentStreak;
  habit.completedToday = true;
  habit.progress = 100;
  await writeDB(db);
  res.json({ habit });
});

app.patch("/api/habits/:id/reminder", authMiddleware, async (req, res) => {
  const db = await readDB();
  const habit = db.habits.find((habitItem) => habitItem.id === req.params.id && habitItem.userId === req.user.id);
  if (!habit) {
    return res.status(404).json({ error: "Habit not found" });
  }
  habit.reminderTime = req.body.reminderTime;
  await writeDB(db);
  res.json({ habit });
});

app.get("/api/goals", authMiddleware, async (req, res) => {
  const db = await readDB();
  res.json({ goals: db.goals.filter((goal) => goal.userId === req.user.id || !goal.userId) });
});

app.post("/api/goals", authMiddleware, async (req, res) => {
  const db = await readDB();
  const { title, description, target, unit } = req.body;
  if (!title || !target || !unit) {
    return res.status(400).json({ error: "title, target and unit are required" });
  }
  const goal = {
    id: `g-${Date.now()}`,
    userId: req.user.id,
    title,
    description: description || "",
    current: 0,
    target,
    unit,
    color: "primary",
    insights: ["Keep tracking to gather insights"],
  };
  db.goals.unshift(goal);
  await writeDB(db);
  res.json({ goal });
});

app.get("/api/journal", authMiddleware, async (req, res) => {
  const db = await readDB();
  const entries = db.journalEntries.filter((entry) => entry.userId === req.user.id);
  res.json({ journalEntries: entries });
});

app.post("/api/journal", authMiddleware, async (req, res) => {
  const db = await readDB();
  const { mood, energy, stress, sleepHours, sleepQuality, preview } = req.body;
  if (preview == null) {
    return res.status(400).json({ error: "preview is required" });
  }
  const entry = {
    id: `j-${Date.now()}`,
    userId: req.user.id,
    date: new Date().toISOString(),
    mood,
    energy,
    stress,
    sleepHours,
    sleepQuality,
    preview,
  };
  db.journalEntries.unshift(entry);
  await writeDB(db);
  res.json({ entry });
});

app.get("/api/leaderboard", async (req, res) => {
  const db = await readDB();
  const top = db.habits
    .filter((habit) => habit.longestStreak > 0)
    .map((habit) => {
      const user = db.users.find((u) => u.id === habit.userId);
      return {
        id: `${habit.id}-${habit.userId}`,
        userId: habit.userId,
        username: user?.username || "Guest",
        habitName: habit.name,
        longestStreak: habit.longestStreak,
        avatar: user?.avatar,
      };
    })
    .sort((a, b) => b.longestStreak - a.longestStreak)
    .slice(0, 20);
  res.json({ leaderboard: top });
});

io.on("connection", async (socket) => {
  socket.on("join-note", async ({ noteId, userId, username }) => {
    const db = await readDB();
    const note = db.notes.find((item) => item.id === noteId);
    if (!note) {
      return socket.emit("note-error", { message: "Note not found" });
    }
    socket.join(noteId);
    socket.to(noteId).emit("presence", { userId, username, status: "joined" });
    socket.emit("note-data", { note });
  });

  socket.on("edit-note", async ({ noteId, content }) => {
    const db = await readDB();
    const note = db.notes.find((item) => item.id === noteId);
    if (!note) return;
    note.content = content;
    note.updatedAt = new Date().toISOString();
    await writeDB(db);
    socket.to(noteId).emit("note-updated", { noteId, content, updatedAt: note.updatedAt });
  });

  socket.on("cursor-update", ({ noteId, cursor, user }) => {
    socket.to(noteId).emit("cursor-update", { noteId, cursor, user });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend server running at ${BASE_URL}`);
});
