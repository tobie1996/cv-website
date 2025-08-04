"use client"

import { useState, useEffect } from 'react'
import { X, Smartphone, Download, Eye, Info } from 'lucide-react'
import { PersonalDetails, Experience, Education, Language, Skill, Hobby } from '@/type'

interface MobileOnboardingProps {
  isVisible: boolean
  onClose: () => void
}

export const MobileOnboarding: React.FC<MobileOnboardingProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg p-6 max-w-sm w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-bold mb-2">Bienvenue sur CV Builder Mobile</h3>
          <p className="text-sm text-gray-600 mb-4">
            Créez votre CV facilement depuis votre téléphone. Voici quelques conseils :
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Prévisualisation</p>
                <p className="text-xs text-gray-600">Utilisez les boutons &quot;Aperçu&quot; pour voir votre CV</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Téléchargement</p>
                <p className="text-xs text-gray-600">Téléchargez votre CV en PDF d&apos;un simple clic</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Navigation</p>
                <p className="text-xs text-gray-600">Remplissez les sections une par une</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="btn btn-primary w-full mt-4"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  )
}

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

interface TouchGestureProps {
  children: React.ReactNode
  onPinch?: (scale: number) => void
  className?: string
}

export const TouchGestureContainer: React.FC<TouchGestureProps> = ({ 
  children, 
  onPinch, 
  className = '' 
}) => {
  const [initialDistance, setInitialDistance] = useState<number | null>(null)

  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setInitialDistance(getDistance(e.touches))
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance && onPinch) {
      e.preventDefault()
      const currentDistance = getDistance(e.touches)
      const scale = currentDistance / initialDistance
      onPinch(scale)
    }
  }

  const handleTouchEnd = () => {
    setInitialDistance(null)
  }

  return (
    <div 
      className={`cv-preview-container ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

export const MobileProgressIndicator: React.FC<{
  personalDetails: PersonalDetails
  experiences: Experience[]
  educations: Education[]
  languages: Language[]
  skills: Skill[]
  hobbies: Hobby[]
}> = ({ personalDetails, experiences, educations, languages, skills, hobbies }) => {
  const calculateProgress = () => {
    let progress = 0
    const sections = [
      { condition: personalDetails.fullName, weight: 20 },
      { condition: experiences.length > 0, weight: 20 },
      { condition: educations.length > 0, weight: 15 },
      { condition: languages.length > 0, weight: 15 },
      { condition: skills.length > 0, weight: 15 },
      { condition: hobbies.length > 0, weight: 15 }
    ]
    
    sections.forEach(section => {
      if (section.condition) progress += section.weight
    })
    
    return Math.min(100, progress)
  }

  const progress = calculateProgress()
  const getProgressColor = () => {
    if (progress < 30) return 'bg-error'
    if (progress < 60) return 'bg-warning'
    if (progress < 90) return 'bg-info'
    return 'bg-success'
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-primary font-medium">Progression</span>
      <div className="flex items-center gap-2">
        <div className="w-32 bg-base-300 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 progress-bar ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium">{progress}%</span>
      </div>
    </div>
  )
}
