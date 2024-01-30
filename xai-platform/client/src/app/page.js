import { SocketIndicator } from "@/components/ui/status";

export default async function Page() {
  return (
    <div className="w-full h-full text-center m-auto">
      Could not load data Model name: <br></br>
      <SocketIndicator></SocketIndicator>
    </div>
  );
}
