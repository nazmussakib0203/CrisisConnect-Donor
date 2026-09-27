"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function VolunteerLoginPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
  }, []);

  return (
    <>
      <Header title="Volunteer Login" />
      <Navigation />
      <p>{email}</p>
    </>
  );
}
