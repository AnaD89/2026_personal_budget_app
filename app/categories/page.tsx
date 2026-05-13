"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data: Category[] = await res.json();

      if (active) {
        setCategories(data);
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  const reload = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  };

  const add = async () => {
    if (!name) return;

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    reload();
  };

  const remove = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div>
      <h1>Categorii</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Categorie nouă"
      />

      <button type="button" onClick={add}>
        Adaugă
      </button>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            {c.name}
            <button type="button" onClick={() => remove(c.id)}>
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}