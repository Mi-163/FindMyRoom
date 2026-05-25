
import SearchHero from "@/components/SearchHero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow">
        <SearchHero />
      </main>
      <Footer />
    </div>
  );
}