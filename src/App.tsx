import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

// --- Types ---
export type Task = {
  id: string;
  description: string;
  deadline?: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tasks");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed)) setTasks(parsed);
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = description.trim();
    if (!text) {
      alert("Description bo'sh bo'lmasligi kerak");
      return;
    }

    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const newTask: Task = {
      id,
      description: text,
      deadline: deadline || undefined,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setDescription("");
    setDeadline("");
  }

  function toggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function onDescriptionChange(e: ChangeEvent<HTMLInputElement>) {
    setDescription(e.currentTarget.value);
  }

  function onDeadlineChange(e: ChangeEvent<HTMLInputElement>) {
    setDeadline(e.currentTarget.value);
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">📝 To‑Do List</h1>

        {/* Form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Task description..."
            value={description}
            onChange={onDescriptionChange}
            className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring"
            required
          />
          <input
            type="date"
            value={deadline}
            onChange={onDeadlineChange}
            className="border rounded-xl px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-xl px-4 py-2 bg-black text-white"
            aria-label="Add task"
          >
            ➕ Add
          </button>
        </form>

        {/* Task list */}
        {tasks.length === 0 ? (
          <p className="text-gray-500">Hali vazifa yo'q. Yangi vazifa qo'shing.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 border rounded-xl px-3 py-2"
              >
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <div className="flex flex-col">
                    <span className={task.completed ? "line-through text-gray-400" : ""}>
                      {task.description}
                    </span>
                    {task.deadline && (
                      <span className="text-xs text-gray-500">
                        Deadline: {task.deadline}
                      </span>
                    )}
                  </div>
                </label>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:underline"
                  aria-label={`Delete ${task.description}`}
                >
                  ❌ Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
