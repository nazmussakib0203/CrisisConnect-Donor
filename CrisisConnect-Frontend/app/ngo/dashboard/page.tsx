"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../_components/statusColor";

export default function NgoDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/profile",
        { headers: { Authorization: "Bearer " + token } },
      );
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Dashboard" />
      {profile != null && (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>{profile.orgName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Registration Number: {profile.regNumber}</p>
            <p>Phone: {profile.phone}</p>
            <p>City: {profile.city}</p>
            <Badge className={statusColor(profile.isActive ? "ACTIVE" : "CLOSED")}>
              {profile.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardContent>
        </Card>
      )}
    </>
  );
}
