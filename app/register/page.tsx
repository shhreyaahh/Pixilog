"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register(){

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){
      alert("Account created");
      router.push("/login");
    }else{
      alert(data.message);
    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >

        <h1 className="text-2xl font-bold text-center">
          Register
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Register
        </button>

      </form>

    </div>

  );
}