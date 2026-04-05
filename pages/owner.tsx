import Head from "next/head";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import { usePortfolio } from "../context/PortfolioContext";

export default function OwnerPage() {
  const { data, setData } = usePortfolio();

  return (
    <>
      <Head>
        <title>Owner Mode | Portfolio</title>
      </Head>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_38%),linear-gradient(to_bottom,#060a18,#03050e)] text-slate-100 antialiased">
        <Navbar resumeUrl={data.hero.resumeUrl} />

        <main>
          <Hero
            hero={data.hero}
            editable
            onChange={(hero) => setData((prev) => ({ ...prev, hero }))}
          />
          <Projects
            projects={data.projects}
            editable
            onChange={(projects) => setData((prev) => ({ ...prev, projects }))}
          />
          <Contact
            channels={data.contacts}
            editable
            onChange={(contacts) => setData((prev) => ({ ...prev, contacts }))}
          />
        </main>

        <Footer
          footer={data.footer}
          editable
          onChange={(footer) => setData((prev) => ({ ...prev, footer }))}
        />
      </div>
    </>
  );
}
