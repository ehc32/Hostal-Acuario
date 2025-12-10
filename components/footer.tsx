"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="w-full bg-[#f8f8f8] border-t border-[#e5e5e5] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">

          {/* Información del Hotel */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold text-[#202020]">Hostal Acuario</h3>
              <p className="text-[#666] text-sm mt-1 max-w-md mx-auto md:mx-0">
                Comodidad, descanso y experiencias únicas en Melgar, Tolima.
              </p>
            </div>

            <div className="space-y-1.5 text-sm text-[#555] pt-2">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <p>Calle 13 #16-53 — Mártires Colombia</p>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <p>+57 318 354 6487</p>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <p>elellanos@hotmail.com</p>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="w-full md:w-[320px] h-[160px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.3371343753736!2d-74.6436400846875!3d4.204595696941198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f28f0b71114b3%3A0x6f11270c5722a465!2sCl.+13%20%2316-53%2C%20Melgar%2C%20Tolima!5e0!3m2!1ses!2sco!4v1709668478423!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Hostal Acuario"
            ></iframe>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-[#888]">
            © {new Date().getFullYear()} Hostal Acuario. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
