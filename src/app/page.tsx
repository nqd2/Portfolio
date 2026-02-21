import { LanguageProvider } from "@/context/LanguageContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import Header from "@/components/section/Header";
import Hero from "@/components/section/Hero";
import About from "@/components/section/About";
import Works from "@/components/section/Works";
import Contact from "@/components/section/Contact";
import ProjectModal from "@/components/section/ProjectModal";
import PortfolioEffects from "@/components/ui/PortfolioEffects";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import Toast from "@/components/ui/Toast";
import CustomCursor from "@/components/ui/CustomCursor";

import LoadingScreen from "@/components/ui/LoadingScreen";
import ProgressBar from "@/components/ui/ProgressBar";
import GSAPInit from "@/components/ui/GSAPInit";

export default function Home() {
  return (
    <LanguageProvider>
    <PortfolioProvider>
      <GSAPInit />
      <LoadingScreen />
      <ProgressBar />
      <BackgroundGrid />
      <CustomCursor />
      <div className="relative w-full" id="app">
        <Header />
        <main>
          <Hero />
          <About />
          <Works />
          <Contact />
        </main>
      </div>
      <ProjectModal />
      <Toast />
      <PortfolioEffects />
    </PortfolioProvider>
    </LanguageProvider>
  );
}
