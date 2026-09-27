"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyCrisesPage() {
  const router = useRouter();
  const [crises, setCrises] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/my-crises",
        { headers: { Authorization: "Bearer " + token } },
      );
      setCrises(response.data.crises);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="My Crises" />
      {message && <p className="text-sm">{message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crises.map((crisis, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{crisis.title}</CardTitle>
              <CardDescription>{crisis.category} · {crisis.city}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const response = await axios.delete(
                      process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/crisis/" + crisis.id + "/leave",
                      { headers: { Authorization: "Bearer " + token } },
                    );
                    setMessage(response.data.message);
                    fetchData();
                  } catch (err: any) {
                    const msg = err.response && err.response.data && err.response.data.message;
                    setMessage(Array.isArray(msg) ? msg[0] : msg || "Something went wrong");
                  }
                }}
              >
                Leave
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
