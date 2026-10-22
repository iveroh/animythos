import { useDocumentTitle } from "../hooks/useDocumentTitle";
import HeroSection from "../ui/HeroSection";

function HomePage() {
  useDocumentTitle();

  return <HeroSection />;
}

export default HomePage;
