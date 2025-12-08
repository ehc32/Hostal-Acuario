"use client"

import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

type FooterProps = {
  hotelName?: string
  tagline?: string
  sections?: FooterSection[]
  socialLinks?: {
    facebook?: string
    instagram?: string
    email?: string
    phone?: string
    location?: string
  }
  copyrightText?: string
}

const defaultSections: FooterSection[] = [
  {
    title: "El Hotel",
    links: [
      { label: "Nosotros", href: "#nosotros" },
      { label: "Habitaciones", href: "#habitaciones" },
      { label: "Servicios", href: "#servicios" },
      { label: "Galería", href: "#galeria" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Piscina", href: "#piscina" },
      { label: "Restaurante", href: "#restaurante" },
      { label: "Parqueadero", href: "#parqueadero" },
      { label: "WiFi", href: "#wifi" },
    ],
  },
  {
    title: "Atención al huésped",
    links: [
      { label: "Preguntas frecuentes", href: "#faq" },
      { label: "Reservas", href: "#reservas" },
      { label: "Contacto", href: "#contacto" },
      { label: "Soporte", href: "#soporte" },
    ],
  },
  {
    title: "Información legal",
    links: [
      { label: "Política de privacidad", href: "#privacidad" },
      { label: "Términos y condiciones", href: "#terminos" },
      { label: "Tratamiento de datos", href: "#datos" },
      { label: "Aviso legal", href: "#aviso" },
    ],
  },
]

export const Footer = ({
  hotelName = "Hostal Acuario",
  tagline = "Comodidad, descanso y experiencias únicas en Melgar, Tolima.",
  sections = defaultSections,
  socialLinks = {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    email: "elellanos@hotmail.com",
    phone: "+57 318 354 6487",
    location: "Calle 13 #16-53 — Mártires Colombia",
  },
  copyrightText,
}: FooterProps) => {
  const currentYear = new Date().getFullYear()
  const copyright =
    copyrightText || `© ${currentYear} ${hotelName}. Todos los derechos reservados.`

  return (
    <footer className="w-full bg-[#f8f8f8] border-t border-[#e5e5e5]">
      <div className="max-w-[1200px] mx-auto px-8 py-16">

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">

          {/* HOTEL INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            <h3 className="text-2xl font-semibold text-[#202020] mb-2">
              {hotelName}
            </h3>

            <p className="text-sm text-[#666] max-w-xs">{tagline}</p>

            {/* Dirección */}
            <div className="mt-4 text-sm text-[#555]">
              <p className="font-semibold text-[#202020] mb-1">Dirección:</p>
              <p>{socialLinks.location}</p>
            </div>

            {/* Contacto */}
            <div className="mt-4 flex flex-col gap-2 text-sm text-[#555]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#333]" />
                <span>{socialLinks.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#333]" />
                <span>{socialLinks.email}</span>
              </div>
            </div>

            {/* Redes */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#ccc] text-[#666] hover:text-[#000] hover:border-[#000] transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#ccc] text-[#666] hover:text-[#000] hover:border-[#000] transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* SECCIONES */}
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="col-span-1"
            >
              <h4 className="text-sm font-semibold text-[#202020] mb-4 uppercase tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-sm text-[#666] hover:text-[#111] transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* COPYRIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-6 border-t border-[#e5e5e5] text-center md:text-left"
        >
          <p className="text-sm text-[#666]">{copyright}</p>
        </motion.div>

      </div>
    </footer>
  )
}
