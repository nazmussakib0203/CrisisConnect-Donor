"use client"
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = z.object({
    cardPin: z.string().min(6,'card number is required'),
});
export default function payDonation(){
    const [error,setError] = useState('');
    const router = useRouter();


    async function handlePayment(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cardPin = formData.get("cardPin");

        const result = schema.safeParse({cardPin});
        if(!result.success)
        {
            console.log(result.error.issues);
            setError("Enter a valid card number");
            return;
        }
        try{
            const token = localStorage.getItem("token");
            const donationId = localStorage.getItem("donationId");
            const userData = {cardNumber:cardPin}
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/donor/donation/${donationId}/pay`,userData,
                {
                    headers:{
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Payment Update:"+ response.data);
            setError("Payment successful");
            
            
        }catch(error){
            console.error("Error making payment",error);
        }

    }

    return (
  <form
    onSubmit={handlePayment}
    className="space-y-5"
  >
    <div>
      <label
        className="border-b border-border bg-background px-6 py-4 text-2xl font-bold text-foreground"
      >
        Card Number
      </label>

      <input
        type="text"
        name="cardPin"
        placeholder="Enter card number"
        className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div className="flex gap-3">
    <button
      type="submit"
      className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
    >
      Checkout
    </button>

    <button
      type="button"
      className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
      
      onClick={() =>{
         const donationId = localStorage.getItem("donationId");
         router.push(`/receipt?donationId=${donationId}`)
        }
      }
       
    >
      View Receipt
    </button>
  </div>

  

    {error && (
      <p className="text-sm text-destructive">
        {error}
      </p>
    )}
  </form>
);
}