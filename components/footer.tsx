import { Mail, Phone, MapPin } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const Footer = async () => {
  // Obtener configuración global (con fallback si falla)
  let config = null;
  try {
    config = await prisma.configuration.findUnique({
      where: { id: 1 }
    });
  } catch (error) {
    console.error("Error fetching config:", error);
  }

  const year = new Date().getFullYear();
  const address = config?.address || "Calle 13 #16-53 Mártires, Colombia";
  const phone = config?.phone || "+57 318 354 6487";
  const cleanPhone = phone.replace(/\D/g, '');
  const email = config?.supportEmail || "elellanos@hotmail.com";
  const siteName = config?.siteName || "Hostal Acuario";

  return (
    <footer id="contacto" className="w-full bg-slate-50 border-t border-gray-200 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Parte Superior: Información Compacta */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">

          {/* Marca + WhatsApp */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{siteName}</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1 leading-relaxed">
                {config?.siteDescription || "Descanso y confort en el corazón."}
              </p>
            </div>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola, deseo más información.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Contactar por WhatsApp
            </a>
          </div>

          {/* Grid de Contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Ubicación</span>
              </div>
              <p className="text-gray-600 text-sm leading-snug">{address}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                <Phone className="w-4 h-4" />
                <span>Teléfono</span>
              </div>
              <p className="text-gray-600 text-sm">{phone}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
              <p className="text-gray-600 text-sm truncate" title={email}>{email}</p>
            </div>
          </div>
        </div>

        {/* Mapa "Largo" (Full Width del contenedor, altura media) */}
        <div className="w-full h-[300px] bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-200 mb-8 grayscale-[10%] hover:grayscale-0 transition-all duration-500">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            title="Ubicación Hostal Acuario"
          ></iframe>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {year} {siteName}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-amber-600 transition-colors">Política de Privacidad</a>
            <a href="#" className="text-xs text-gray-400 hover:text-amber-600 transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
