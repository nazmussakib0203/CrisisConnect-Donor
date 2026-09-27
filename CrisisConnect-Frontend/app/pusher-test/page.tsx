"use client";

import Pusher from "pusher-js";
import { useEffect } from "react";

export default function PusherTest() {
  useEffect(() => {
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    );

    const channel = pusher.subscribe("ngo-channel");

    channel.bind("new-donation", (data: any) => {
      console.log("NEW DONATION:", data);

      alert(`New donation received: ${data.amount}`);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Pusher Test</h1>
      <p>Waiting for new donations...</p>
    </div>
  );
}