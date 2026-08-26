import Preloader from "@/components/Preloader";
import SequenceHero from "@/components/SequenceHero";
import Overview from "@/components/Overview";
import Specs from "@/components/Specs";
import Journal from "@/components/Journal";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="flex flex-1 flex-col">
        <SequenceHero />
        <Overview />
        <Specs />
        <Journal />
        <Contact />
      </main>
    </>
  );
}
