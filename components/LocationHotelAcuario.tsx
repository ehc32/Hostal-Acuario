"use client"

import { MapPin, Plane, UtensilsCrossed, Camera, ExternalLink, Navigation, Send, User, Mail, Phone, MessageSquare, Calendar } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const HOTEL_LOCATION = {
  lat: 2.930316,
  lng: -75.294449,
  address: "Calle 13 #16-53 — Mártires, Melgar, Tolima, Colombia",
  shortAddress: "Calle 13 #16-53, Melgar 734001 Colombia"
}
export function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'restaurants' | 'attractions'>('restaurants')
  const [mapLoaded, setMapLoaded] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    message: ''
  })

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_I52O9OyvRwGMw_JSRin6TpMSCBSwaFg&language=es`
      script.async = true
      script.defer = true
      script.onload = () => initMap()
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!mapRef.current || !window.google) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: HOTEL_LOCATION,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      new window.google.maps.Marker({
        position: HOTEL_LOCATION,
        map: map,
        title: "Hotel Acuario",
        icon: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='50' viewBox='0 0 40 50'%3E%3Cpath fill='%2314b8a6' d='M20 0C8.96 0 0 8.96 0 20c0 14 20 30 20 30s20-16 20-30C40 8.96 31.04 0 20 0zm0 28c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3C/svg%3E",
          scaledSize: new window.google.maps.Size(40, 50)
        }
      })

      setMapLoaded(true)
    }

    loadGoogleMaps()
  }, [])

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}`, '_blank')
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    alert('¡Gracias por tu consulta! Te contactaremos pronto.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="ubicacion" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase 
                         text-teal-600 mb-3 px-4 py-1.5 bg-teal-50 rounded-full">
            Encuéntranos
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Ubicación y Contacto
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos ubicados en el corazón de Melgar. Contáctanos para reservar tu estadía.
          </p>
        </div>

        {/* GRID: Formulario + Mapa */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* IZQUIERDA - FORMULARIO */}
          <div className="space-y-6">
            {/* Info de dirección */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Nuestra Dirección</h3>
                  <p className="text-gray-700">{HOTEL_LOCATION.shortAddress}</p>
                  <button 
                    onClick={openInGoogleMaps}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2 
                             flex items-center gap-1 group"
                  >
                    Abrir en Google Maps 
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 rounded-lg p-3 mt-4">
                <Navigation className="w-4 h-4 text-teal-600" />
                <span>Lat: {HOTEL_LOCATION.lat}° N</span>
                <span>•</span>
                <span>Lng: {HOTEL_LOCATION.lng}° W</span>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Solicita Información</h3>
              <p className="text-gray-600 mb-6">Completa el formulario y te contactaremos pronto</p>

              <div className="space-y-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl
                               focus:ring-2 focus:ring-teal-500 focus:border-transparent
                               transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email y Teléfono en fila */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl
                                 focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+57 300 123 4567"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl
                                 focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl
                                 focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl
                                 focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tu reserva..."
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl
                               focus:ring-2 focus:ring-teal-500 focus:border-transparent
                               transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Botón enviar */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 
                           hover:from-teal-700 hover:to-teal-800
                           text-white font-semibold py-4 rounded-xl
                           shadow-lg hover:shadow-xl
                           transform hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200
                           flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Consulta
                </button>
              </div>
            </div>

            {/* Aeropuertos cercanos */}
          
          </div>

          {/* DERECHA - MAPA */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 h-[700px] lg:sticky lg:top-24 group">
              <div ref={mapRef} className="w-full h-full bg-gray-200" />
              
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Cargando mapa...</p>
                  </div>
                </div>
              )}

              <button
                onClick={openInGoogleMaps}
                className="absolute top-4 right-4 bg-white hover:bg-gray-50 rounded-xl p-3 shadow-lg 
                         transition-all duration-300 group-hover:scale-110"
                aria-label="Abrir en pantalla completa"
              >
                <ExternalLink className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlaceCard({ place, type }: { place: any; type: 'restaurant' | 'attraction' }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl 
                    hover:bg-gray-100 transition-all duration-300 group cursor-pointer">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
          {place.name}
        </h4>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-medium text-gray-900">{place.rating}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i < Math.floor(place.rating) ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({place.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
          <Navigation className="w-3 h-3" />
          <span>{place.distance}</span>
          {type === 'restaurant' && (
            <>
              <span>•</span>
              <span>{place.price}</span>
              <span>•</span>
              <span>{place.cuisine}</span>
            </>
          )}
          {type === 'attraction' && (
            <>
              <span>•</span>
              <span className="truncate">{place.type}</span>
            </>
          )}
        </div>
      </div>

      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-600 
                              transition-colors flex-shrink-0 ml-4" />
    </div>
  )
}