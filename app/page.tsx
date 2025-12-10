import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { RoomsGrid } from "@/components/rooms-grid"
import { Footer } from "@/components/footer"
import { FAQSection } from "@/components/FAQSection"
import { InfoHotelAcuario } from "@/components/HotelInfo"
import { ImageCarousel } from "@/components/image-carousel"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <RoomsGrid />
      <ImageCarousel />
      <InfoHotelAcuario />
      <FAQSection />
      <Footer />
    </main>
  )
}
