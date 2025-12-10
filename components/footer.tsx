"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">

        {/* Marca y Slogan */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Hostal Acuario</h3>
          <p className="text-gray-500 font-light text-base max-w-lg mx-auto leading-relaxed">
            Comodidad, descanso y experiencias únicas en Melgar, Tolima.
          </p>
        </div>

        {/* Separador sutil */}
        <div className="w-16 h-0.5 bg-amber-500 mx-auto opacity-50 rounded-full"></div>

        {/* Información de Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-gray-50 rounded-full text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Calle 13 #16-53</p>
            <p className="text-xs text-gray-400">Mártires, Colombia</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-gray-50 rounded-full text-amber-600">
              <Phone className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">+57 318 354 6487</p>
            <p className="text-xs text-gray-400">Reservas y Atención</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-gray-50 rounded-full text-amber-600">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">elellanos@hotmail.com</p>
            <p className="text-xs text-gray-400">Contáctanos</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Hostal Acuario. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
