"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../../_components/statusColor";

export default function CallApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [error, setError] = useState("");

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
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/volunteer-call/" + params.id + "/applicants",
        { headers: { Authorization: "Bearer " + token } },
      );
      setApplicants(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Applicants" />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applicants.map((application, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{application.volunteer.fullName}</CardTitle>
              <CardDescription>{application.volunteer.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{application.message}</p>
              <Badge className={"mt-2 " + statusColor(application.status)}>{application.status}</Badge>
            </CardContent>
            {application.status === "PENDING" && (
              <CardFooter className="gap-2">
                <Button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.post(
                        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/application/" + application.id + "/approve",
                        {},
                        { headers: { Authorization: "Bearer " + token } },
                      );
                      fetchData();
                    } catch (err: any) {
                      const message = err.response && err.response.data && err.response.data.message;
                      setError(Array.isArray(message) ? message[0] : message || "Something went wrong");
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.patch(
                        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/application/" + application.id + "/reject",
                        {},
                        { headers: { Authorization: "Bearer " + token } },
                      );
                      fetchData();
                    } catch (err: any) {
                      const message = err.response && err.response.data && err.response.data.message;
                      setError(Array.isArray(message) ? message[0] : message || "Something went wrong");
                    }
                  }}
                >
                  Reject
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
