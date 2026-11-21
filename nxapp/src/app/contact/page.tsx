"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ajouté : l'email est invalide s'il n'est pas vide et n'a pas le format x@y.z
  const emailInvalid =
    formData.email !== "" && !/^\S+@\S+\.\S+$/.test(formData.email);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page reload
    console.log("Form submitted:", formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      {emailInvalid && <small>Please enter a valid email</small>} {/* ajouté */}
      <button type="submit" disabled={!formData.name || !formData.email || emailInvalid}> {/* modifié */}
        Submit
      </button>
    </form>
  );
}