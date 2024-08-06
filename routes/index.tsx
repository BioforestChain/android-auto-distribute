import { useSignal } from "@preact/signals";
import Navbar from "../islands/Navbar.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <div  class="container mx-auto shadow-md">
        <Navbar  />
    </div>
  );
}
