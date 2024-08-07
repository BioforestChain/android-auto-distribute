import { PageProps } from "$fresh/server.ts";
import Footer from "../components/Footer.tsx";
import Menu from "../components/Menu.tsx";
import Navbar from "../components/Navbar.tsx";

export default function Layout({
  Component,
}: PageProps) {
  return (
    <>
      <div class="container mx-auto">
        <div class="mb-3">
          <Navbar />
        </div>
        <div class="flex flex-row">
          <aside>
            <Menu />
          </aside>
          <div class="grow m-3">
            <Component />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}