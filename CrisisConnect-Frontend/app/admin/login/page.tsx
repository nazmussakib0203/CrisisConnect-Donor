"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
  }, []);

  return (
    <>
      <Header title="Admin Login" />
      <Navigation />
      <p>{email}</p>
    </>
  );
}
