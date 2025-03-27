import Map from "@/components/map";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div className="min-h-screen w-screen">
      <div className="flex min-h-screen w-screen items-center justify-center">
        <Map />
      </div>
      <Nav />
    </div>
  );
}
