"use client"
import { useState } from "react";
import Header from "@/components/Header";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = z.object({
    otp: z.string().min(6),
});

export default function verifyRegistration(){
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    function handleVerifySubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        const data = { otp };
        const result =schema.safeParse(data);
        if(!result.success){
            console.log(result.error.issues);
            setError("Insert valid OTP");
            return;
        }
        setError("");
        verifyOTP();
    }
    async function verifyOTP(){
        const email = localStorage.getItem('email');
        
        try{
            const userOTP = {code:otp,email};
            const response = await axios.post('http://localhost:3000/donor/verify-otp', userOTP );
            console.log("SIGNUP RESPONSE:", response.data);
            console.log(response);
            router.push('/login');
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
        }
    }
    return (
        <>
            <Header title="Verify Registration"/>
            <br></br>
            <form onSubmit={handleVerifySubmit}>
                <label>Enter OTP:</label>
                <input name="otp" value={otp} onChange={(e) => setOtp(e.target.value)}/>
                <br></br>
                <button>Verify</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <br></br>
            
        </>
    );
}