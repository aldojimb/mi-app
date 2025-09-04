import React, { useEffect, useMemo, useState } from "react";

// Simple SVG icon (bike) so the component has no external deps
const BikeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${props.className || ""}`}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M5 17.5L9.5 9h5l2.5 4.5H10" />
    <path d="M12 9V6M14 6h-4" />
  </svg>
);

// Tiny in-memory router-like tabs
const TABS = [
  { id: "home", label: "Inicio" },
  { id: "contador", label: "Contador" },
  { id: "tareas", label: "Tareas" },
  { id: "contacto", label: "Contacto" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <BikeIcon />
            <span>Bicelona — Mini App</span>
          </div>
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded-xl text-sm transition border ${
                  tab === t.id
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-200"
                }`}
                aria-current={tab === t.id ? "page" : undefined}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === "home" && <Home />}
        {tab === "contador" && <Counter />}
        {tab === "tareas" && <Todos />}
        {tab === "contacto" && <ContactForm />}
      </main>

      <footer className="max-w-5xl mx-auto px-4 pb-10 text-xs text-neutral-500">
        <p>
          Hecho con React + Tailwind (estilo limpio, bordes 2xl y sombras suaves). Listo
          para desplegar en Vercel/Netlify.
        </p>
      </footer>
    </div>
  );
}

function Card({ title, subtitle, children, actions }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
        {actions}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card
        title="Bienvenido 👋"
        subtitle="Esta es una mini app en React con 3 módulos básicos."
      >
        <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
          <li>
            <strong>Contador:</strong> estado y eventos.
          </li>
          <li>
            <strong>Tareas:</strong> CRUD simple con localStorage.
          </li>
          <li>
            <strong>Contacto:</strong> formulario con validación mínima.
          </li>
        </ul>
      </Card>

      <Card title="Siguiente paso" subtitle="Cómo convertir esto en una web pública">
        <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-700">
          <li>Crea un proyecto con Vite o Next.js.</li>
          <li>Agrega TailwindCSS.</li>
          <li>Sube el repo a GitHub.</li>
          <li>Conecta con Vercel o Netlify y despliega.</li>
        </ol>
        <p className="text-sm text-neutral-500 mt-3">
          Más instrucciones en el mensaje de chat (debajo).
        </p>
      </Card>
    </div>
  );
}

function Counter() {
  const [value, setValue] = useState(0);
  return (
    <div className="max-w-md">
      <Card title="Contador" subtitle="Demuestra estado + eventos">
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100"
            onClick={() => setValue((v) => v - 1)}
          >
            −
          </button>
          <span className="text-2xl font-semibold tabular-nums min-w-[3ch] text-center">
            {value}
          </span>
          <button
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100"
            onClick={() => setValue((v) => v + 1)}
          >
            +
          </button>
          <button
            className="ml-auto px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100"
            onClick={() => setValue(0)}
          >
            Reset
          </button>
        </div>
      </Card>
    </div>
  );
}

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function Todos() {
  const [items, setItems] = useLocalStorage("todos-demo", []);
  const [text, setText] = useState("");
  const left = useMemo(() => items.filter((i) => !i.done).length, [items]);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setItems((list) => [...list, { id: crypto.randomUUID(), text: t, done: false }]);
    setText("");
  };

  const toggle = (id) =>
    setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const remove = (id) => setItems((list) => list.filter((i) => i.id !== id));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title="Tareas" subtitle="Se guardan en tu navegador">
        <div className="flex gap-2 mb-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Añade una tarea..."
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
          <button onClick={add} className="px-4 py-2 rounded-xl bg-neutral-900 text-white">
            Añadir
          </button>
        </div>
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
              <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} />
              <span className={`flex-1 text-sm ${i.done ? "line-through text-neutral-400" : ""}`}>
                {i.text}
              </span>
              <button onClick={() => remove(i.id)} className="text-xs text-neutral-500 hover:text-red-600">
                borrar
              </button>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">Sin tareas todavía. ¡Crea la primera!</p>
        )}
      </Card>

      <Card title="Resumen" subtitle="Estado de la lista">
        <p className="text-sm text-neutral-700">Pendientes: {left}</p>
        <p className="text-sm text-neutral-700">Total: {items.length}</p>
        <button
          onClick={() => setItems([])}
          className="mt-3 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100"
        >
          Vaciar lista
        </button>
      </Card>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (form.message.trim().length < 10) e.message = "Mínimo 10 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    // Simulación de envío
    setTimeout(() => {
      setSent(true);
    }, 400);
  }

  if (sent) {
    return (
      <Card title="¡Gracias!" subtitle="Tu mensaje ha sido enviado (demo)">
        <p className="text-sm text-neutral-700">
          En producción, conecta este formulario con un servicio como Formspree, Resend,
          Netlify Forms, o tu propio backend.
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-lg">
      <Card title="Contacto" subtitle="Formulario con validación mínima">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm">Nombre</label>
            <input
              className={`w-full px-3 py-2 rounded-xl border ${
                errors.name ? "border-red-400" : "border-neutral-200"
              }`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              className={`w-full px-3 py-2 rounded-xl border ${
                errors.email ? "border-red-400" : "border-neutral-200"
              }`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="text-sm">Mensaje</label>
            <textarea
              rows={4}
              className={`w-full px-3 py-2 rounded-xl border ${
                errors.message ? "border-red-400" : "border-neutral-200"
              }`}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {errors.message && (
              <p className="text-xs text-red-600 mt-1">{errors.message}</p>
            )}
          </div>
          <div className="pt-2">
            <button type="submit" className="px-4 py-2 rounded-xl bg-neutral-900 text-white">
              Enviar
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}