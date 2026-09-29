"use client";
import React from "react";
  
export default function StationInputForm() {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the page from reloading

    const formData = new FormData(event.currentTarget);
    const stationinput = formData.get("stationinput") as string;
    console.log("Station Input: ", stationinput);
  }

  return (
    <form onSubmit={handleSubmit}>
        <input name="stationInput" placeholder="駅名" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"/>
    </form>
  );
}