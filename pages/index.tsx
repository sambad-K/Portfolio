import Head from "next/head";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import { usePortfolio } from "../context/PortfolioContext";

export default function Home() {
  const { data } = usePortfolio();

  return (
    <>
      <Head>
        <title>Sambad Khatiwada | Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Sambad Khatiwada, computer engineering student focused on building scalable and performant software."
        />
      </Head>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_38%),linear-gradient(to_bottom,#060a18,#03050e)] text-slate-100 antialiased">
        <Navbar resumeUrl={data.hero.resumeUrl} />
        <main>
          <Hero hero={data.hero} />
          <Projects projects={data.projects} />
          <Contact channels={data.contacts} />
        </main>
        <Footer footer={data.footer} />
      </div>
    </>
  );
}
