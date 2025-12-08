'use client'

import { useState } from 'react'
import { User, Heart, Star, Settings, Calendar } from 'lucide-react'
import { ProfileInfo } from './ProfileInfo'
import { FavoritesList } from './FavoritesList'
import { SettingsAccordion } from './SettingsAccordion'
import { MyReservations } from './MyReservations'

export function ProfileTabs() {
    const [activeTab, setActiveTab] = useState('info')

    const tabs = [
        { id: 'info', label: 'Información Personal', icon: User },
        { id: 'reservations', label: 'Mis Reservaciones', icon: Calendar },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ]

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de Tabs */}
            <div className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4
                  ${activeTab === tab.id
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 border-transparent'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1">
                {activeTab === 'info' && <ProfileInfo />}
                {activeTab === 'favorites' && <FavoritesList />}
                {activeTab === 'reservations' && <MyReservations />}
                {activeTab === 'reviews' && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border text-center py-12">
                        <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sin reseñas aún</h3>
                        <p className="text-gray-500 dark:text-gray-400">Tus reseñas de alojamientos aparecerán aquí.</p>
                    </div>
                )}
                {activeTab === 'settings' && <SettingsAccordion />}
            </div>
        </div>
    )
}
