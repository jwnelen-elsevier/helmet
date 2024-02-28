"use client";
import techniques from "@/data/techniques";

export default async function Page() {
  return (
    <div className="container mx-auto text-center">
      <h1 className="">Information</h1>
      {techniques.map((technique, index) => {
        const { name, description, fullDescription } = technique;

        return (
          <div key={index} className="p-4">
            <h2 className="">{name}</h2>
            <h3>{description}</h3>
            <p>{fullDescription}</p>
          </div>
        );
      })}
    </div>
  );
}
