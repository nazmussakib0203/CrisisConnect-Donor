"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ViewReceipt() {
  const [receiptNo, setReceiptNo] = useState("");
  const [amount, setAmount] = useState("");
  const [issuedAt, setIssuedAt] = useState("");

  useEffect(() => {
    async function getReceipt() {
      const donationId = localStorage.getItem("donationId");
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/donor/donation/receipt/${donationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReceiptNo(response.data.receiptNo);
        setAmount(response.data.amount);
        setIssuedAt(response.data.issuedAt);
      } catch (error) {
        console.error("Error getting receipt:", error);
      }
    }

    getReceipt();
  }, []);

  return (
    <div>
      <p>Receipt No: {receiptNo}</p>
      <p>Amount: {amount}</p>
      <p>Issued At: {issuedAt}</p>
    </div>
  );
}