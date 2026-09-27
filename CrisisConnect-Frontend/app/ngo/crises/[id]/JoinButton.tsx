"use client";

import { useState } from "react";
import axios from "axios";

export default function JoinButton(props: { crisisId: number }) {
  const { crisisId } = props;
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        onClick={async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/crisis/" + crisisId + "/join",
              {},
              { headers: { Authorization: "Bearer " + token } },
            );
            setMessage(response.data.message);
          } catch (err: any) {
            const message = err.response && err.response.data && err.response.data.message;
            setMessage(Array.isArray(message) ? message[0] : message || "Something went wrong");
          }
        }}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Join Crisis
      </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
