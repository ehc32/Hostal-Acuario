"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    question: "¿Cuál es el horario de Check-in y Check-out en Hotel Acuario?",
    answer:
      "El Check-in está disponible desde las 3:00 p.m. y el Check-out debe realizarse antes de las 12:00 p.m. Si necesitas un horario especial, puedes solicitarlo con anticipación y estará sujeto a disponibilidad."
  },
  {
    question: "¿Qué servicios incluye el Hotel Acuario?",
    answer:
      "WiFi gratuito, TV por cable, zonas comunes y servicio de bedidas y snacks."
  },
  {
    question: "¿El hotel cuenta con restaurante o servicio de comidas?",
    answer:
      "Sí, disponemos de restaurante con menú variado y opciones típicas de la región. También ofrecemos snacks y bebidas durante el día."
  },


]

export const FAQSection = ({
  title = "Preguntas frecuentes",
  faqs = defaultFAQs
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Columna izquierda - Título */}
          <div className="lg:col-span-4">
            <h2
              className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight sticky top-24"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px"
              }}
            >
              {title}
            </h2>
          </div>

          {/* Columna derecha - Items FAQ */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#e5e5e5] last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-lg leading-7 text-[#202020] pr-8"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                        fontWeight: "400"
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-6 h-6 text-[#202020]" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1
                        }}
                        exit={{
                          height: 0,
                          opacity: 0
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12">
                          <p
                            className="text-lg leading-6 text-[#666666]"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree"
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
