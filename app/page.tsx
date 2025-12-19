import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { RoomsGrid } from "@/components/rooms-grid"
import { Footer } from "@/components/footer"
import { FAQSection } from "@/components/FAQSection"
import { InfoHotelAcuario } from "@/components/HotelInfo"
import { ImageCarousel } from "@/components/image-carousel"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getConfiguration() {
  try {
    const config = await prisma.configuration.findUnique({
      where: { id: 1 }
    })
    return config as any
  } catch (error) {
    console.error("Error loading configuration:", error)
    return null
  }
}

export default async function Home() {
  const config = await getConfiguration()

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero
        imageUrl={config?.heroImage || undefined}
      />
      <RoomsGrid />
      <ImageCarousel
        images={config?.galleryImages && config.galleryImages.length > 0 ? config.galleryImages : undefined}
      />
      <InfoHotelAcuario
        imageUrl={config?.infoImage || undefined}
      />
      <FAQSection />
      <Footer />
    </main>
  )
}
