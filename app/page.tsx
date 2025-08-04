"use client"
import { Eye, RotateCw, Save } from "lucide-react";
import Image from "next/image";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import { useEffect, useRef, useState } from "react";
import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from "@/type";
import { educationsPreset, experiencesPreset, hobbiesPreset, languagesPreset, personalDetailsPreset, skillsPreset } from "@/presets";
import CVPreview from "./components/CVPreview";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import LanguageForm from "./components/LanguageForm";
import SkillForm from "./components/SkillForm";
import HobbyForm from "./components/HobbyForm";
import { MobileOnboarding, MobileProgressIndicator, TouchGestureContainer } from "./components/MobileHelpers";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import confetti from "canvas-confetti"

export default function Home() {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(personalDetailsPreset)
  const [file, setFile] = useState<File | null>(null)
  const [theme, setTheme] = useState<string>('cupcake')
  const [zoom, setZoom] = useState<number>(163)
  const [experiences, setExperience] = useState<Experience[]>(experiencesPreset)
  const [educations, setEducations] = useState<Education[]>(educationsPreset)
  const [languages, setLanguages] = useState<Language[]>(languagesPreset)
  const [skills, setSkills] = useState<Skill[]>(skillsPreset)
  const [hobbies, setHobbies] = useState<Hobby[]>(hobbiesPreset);
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)
  const [previewZoom, setPreviewZoom] = useState<number>(50)

  useEffect(() => {
    const defaultImageUrl = '/profile.jpg'
    fetch(defaultImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const defaultFile = new File([blob], "profile.jpg", { type: blob.type })
        setFile(defaultFile)
      })

    // Détecter si on est sur mobile
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      // Afficher l'onboarding la première fois sur mobile
      if (mobile && !localStorage.getItem('cv-builder-onboarding-seen')) {
        setTimeout(() => setShowOnboarding(true), 1000) // Délai pour laisser la page se charger
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ]

  const handleResetPersonalDetails = () => setPersonalDetails(
    {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      photoUrl: '',
      postSeeking: '',
      description: ''
    }
  )

  const handleResetExperiences = () => setExperience([])
  const handleResetEducations = () => setEducations([])
  const handleResetLanguages = () => setLanguages([])
  const handleResetSkills = () => setSkills([])
  const handleResetHobbies = () => setHobbies([]);

  const cvPreviewRef = useRef<HTMLDivElement>(null)

  const handleDownloadPdf = async () => {
    // Ouvrir la modal d'abord si on est sur mobile
    if (isMobile) {
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      if (modal && !modal.open) {
        modal.showModal()
        // Attendre un peu que la modal se charge complètement
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    const element = cvPreviewRef.current
    if(element){
      try {
        // Afficher un message de chargement sur mobile
        if (isMobile) {
          const loadingToast = document.createElement('div')
          loadingToast.className = 'toast toast-top toast-center z-[100]'
          loadingToast.innerHTML = `
            <div class="alert alert-info">
              <span class="loading loading-spinner loading-sm"></span>
              Génération du PDF en cours...
            </div>
          `
          document.body.appendChild(loadingToast)
          
          // Supprimer le toast après 3 secondes
          setTimeout(() => {
            if (document.body.contains(loadingToast)) {
              document.body.removeChild(loadingToast)
            }
          }, 3000)
        }

        // Obtenir toutes les pages du CV
        const pageElements = element.querySelectorAll('[data-page]')
        
        let pdf: jsPDF
        
        if (pageElements.length === 0) {
          // Fallback : traiter comme une seule page
          const canvas = await html2canvas(element, {
            scale: isMobile ? 2 : 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
          })
          
          const imgData = canvas.toDataURL('image/png', 0.8)
          pdf = new jsPDF({
            orientation:"portrait",
            unit:'mm',
            format:"A4"
          })
          
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width 

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        } else {
          // Traiter chaque page séparément
          pdf = new jsPDF({
            orientation:"portrait",
            unit:'mm',
            format:"A4"
          })
          
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()

          for (let i = 0; i < pageElements.length; i++) {
            const pageElement = pageElements[i] as HTMLElement
            
            // Afficher un message de progression sur mobile
            if (isMobile && pageElements.length > 1) {
              const progressToast = document.createElement('div')
              progressToast.className = 'toast toast-top toast-center z-[100]'
              progressToast.innerHTML = `
                <div class="alert alert-info">
                  <span class="loading loading-spinner loading-sm"></span>
                  Page ${i + 1}/${pageElements.length}...
                </div>
              `
              document.body.appendChild(progressToast)
              
              setTimeout(() => {
                if (document.body.contains(progressToast)) {
                  document.body.removeChild(progressToast)
                }
              }, 1000)
            }
            
            // Capturer cette page spécifique
            const canvas = await html2canvas(pageElement, {
              scale: isMobile ? 2 : 3,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: pageElement.scrollWidth,
              height: pageElement.scrollHeight,
            })
            
            const imgData = canvas.toDataURL('image/png', 0.8)
            
            // Ajouter une nouvelle page si ce n'est pas la première
            if (i > 0) {
              pdf.addPage()
            }
            
            // Calculer les dimensions pour s'adapter à la page A4
            const imgWidth = pdfWidth
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            
            // Si l'image est trop haute, l'ajuster à la hauteur de la page
            if (imgHeight > pdfHeight) {
              const scaledWidth = (canvas.width * pdfHeight) / canvas.height
              pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, pdfHeight)
            } else {
              pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
            }
          }
        }
        
        // Nom du fichier avec timestamp pour mobile
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        const fileName = isMobile ? `CV_${timestamp}.pdf` : 'cv.pdf'
        
        pdf.save(fileName)

        // Fermer la modal seulement si elle a été ouverte automatiquement
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement
        if(modal && modal.open){
          modal.close()
        }

        // Animation de succès
        confetti({
             particleCount: isMobile ? 50 : 100,
             spread: 70 ,
             origin: {y: isMobile ? 0.7 : 0.6},
             zIndex:9999
        })

        // Toast de succès sur mobile
        if (isMobile) {
          const successToast = document.createElement('div')
          successToast.className = 'toast toast-bottom toast-center z-[100]'
          successToast.innerHTML = `
            <div class="alert alert-success">
              <span>✅ PDF téléchargé avec succès!</span>
            </div>
          `
          document.body.appendChild(successToast)
          
          setTimeout(() => {
            if (document.body.contains(successToast)) {
              document.body.removeChild(successToast)
            }
          }, 3000)
        }

      } catch (error) {
         console.error('Erreur lors de la génération du PDF :', error);
         
         // Toast d'erreur
         const errorToast = document.createElement('div')
         errorToast.className = 'toast toast-top toast-center z-[100]'
         errorToast.innerHTML = `
           <div class="alert alert-error">
             <span>❌ Erreur lors de la génération du PDF</span>
           </div>
         `
         document.body.appendChild(errorToast)
         
         setTimeout(() => {
           if (document.body.contains(errorToast)) {
             document.body.removeChild(errorToast)
           }
         }, 3000)
      }
    } else {
      // Si l'élément n'est pas trouvé, ouvrir la modal d'abord
      if (isMobile) {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement
        if (modal) {
          modal.showModal()
        }
        
        const infoToast = document.createElement('div')
        infoToast.className = 'toast toast-top toast-center z-[100]'
        infoToast.innerHTML = `
          <div class="alert alert-info">
            <span>Veuillez patienter, puis cliquez à nouveau sur Télécharger</span>
          </div>
        `
        document.body.appendChild(infoToast)
        
        setTimeout(() => {
          if (document.body.contains(infoToast)) {
            document.body.removeChild(infoToast)
          }
        }, 3000)
      }
    }
  }

  // Fonction de téléchargement spécifique pour mobile avec pré-chargement
  const handleMobileDownload = async () => {
    // Ouvrir la modal et attendre qu'elle se charge
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement
    if (modal) {
      modal.showModal()
      
      // Attendre que le contenu se charge
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Puis télécharger
      await handleDownloadPdf()
    }
  }


  return (
    <div>
      <div className="hidden lg:block">
        <section className="flex items-center h-screen">

          <div className="w-1/3 h-full p-10 bg-base-200 scrollable no-scrollbar ">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold italic">
                CV
                <span className="text-primary">Builder</span>

              </h1>

              <button className="btn btn-primary" onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                Prévisualiser
                <Eye className="w-4" />
              </button>
            </div>

            <div className="flex  flex-col gap-6 rounded-lg">

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Qui êtes-vous ?</h1>
                <button
                  onClick={handleResetPersonalDetails}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>

              <PersonalDetailsForm
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                setFile={setFile}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Expériences</h1>
                <button
                  onClick={handleResetExperiences}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>

              <ExperienceForm
                experience={experiences}
                setExperiences={setExperience}
              />


              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Éducations</h1>
                <button
                  onClick={handleResetEducations}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>

              <EducationForm
                educations={educations}
                setEducations={setEducations}
              />

              <div className="flex justify-between items-center">
                <h1 className="badge badge-primary badge-outline">Langues</h1>
                <button
                  onClick={handleResetLanguages}
                  className="btn btn-primary btn-sm">
                  <RotateCw className="w-4" />
                </button>
              </div>

              <LanguageForm
                languages={languages}
                setLanguages={setLanguages}
              />

              <div className="flex justify-between">

                <div className="w-1/2">
                  <div className="flex justify-between items-center">
                    <h1 className="badge badge-primary badge-outline">Compétences</h1>
                    <button
                      onClick={handleResetSkills}
                      className="btn btn-primary btn-sm">
                      <RotateCw className="w-4" />
                    </button>
                  </div>
                  <SkillForm skills={skills} setSkills={setSkills} />
                </div>

                <div className="ml-4 w-1/2">
                  <div className="flex justify-between items-center">
                    <h1 className="badge badge-primary badge-outline">Loisirs</h1>
                    <button
                      onClick={handleResetHobbies}
                      className="btn btn-primary btn-sm">
                      <RotateCw className="w-4" />
                    </button>
                  </div>
                  <HobbyForm hobbies={hobbies} setHobbies={setHobbies} />
                </div>



              </div>


            </div>

          </div>

          <div className="w-2/3 h-full bg-base-100 bg-[url('/file.svg')] bg-cover  bg-center scrollable-preview relative">


            <div className="flex items-center justify-center fixed z-[9999] top-5 right-5">
              <input
                type="range"
                min={50}
                max={200}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="range range-xs range-primary" />
              <p className="ml-4 text-sm text-primary">{zoom}%</p>
            </div>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="select select-bordered fixed z-[9999] select-sm top-12 right-5"
            >
              {themes.map((themeName) => (
                <option key={themeName} value={themeName}>
                  {themeName}
                </option>
              ))}
            </select>

            <div
              className="flex justify-center items-center"
              style={{
                transform: `scale(${zoom / 200})`
              }}
            >
              <CVPreview
                personalDetails={personalDetails}
                file={file}
                theme={theme}
                experiences={experiences}
                educations={educations}
                languages={languages}
                hobbies={hobbies}
                skills={skills}
                isMobile={false}
              />
            </div>

          </div>

        </section>




        <dialog id="my_modal_3" className="modal">
          <div className="modal-box w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 h-full max-h-[95vh] lg:max-h-none">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50">✕</button>
            </form>

            <div className="mt-5 h-full flex flex-col">
              {/* Header avec contrôles */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5 bg-base-200/50 p-3 rounded-lg sticky top-0 z-40">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="select select-bordered select-sm w-full sm:w-auto"
                  >
                    {themes.map((themeOption) => (
                      <option key={themeOption} value={themeOption}>
                        {themeOption}
                      </option>
                    ))}
                  </select>
                  
                  {/* Contrôle de zoom pour mobile */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <span className="text-xs">Zoom:</span>
                    <input
                      type="range"
                      min={25}
                      max={100}
                      value={zoom/2}
                      onChange={(e) => setZoom(Number(e.target.value) * 2)}
                      className="range range-xs range-primary flex-1" />
                    <span className="text-xs">{Math.round(zoom/2)}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={handleDownloadPdf} 
                    className="btn btn-primary btn-sm sm:btn-md flex-1 sm:flex-none"
                  >
                    <Save className='w-4' />
                    Télécharger
                  </button>
                  <button 
                    onClick={() => {
                      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
                      if (modal) modal.close();
                    }}
                    className="btn btn-ghost btn-sm sm:btn-md lg:hidden"
                  >
                    Fermer
                  </button>
                </div>
              </div>

              {/* Container de prévisualisation avec scroll */}
              <div className="flex-1 overflow-auto bg-gray-100 rounded-lg p-2 lg:p-4">
                <div className="flex justify-center items-start min-h-full">
                  <div 
                    className="transform origin-top transition-transform duration-200"
                    style={{
                      transform: `scale(${isMobile ? zoom/200 : 1})`
                    }}
                  >
                    <CVPreview
                      personalDetails={personalDetails}
                      file={file}
                      theme={theme}
                      experiences={experiences}
                      educations={educations}
                      languages={languages}
                      hobbies={hobbies}
                      skills={skills}
                      isMobile={isMobile}
                      download={true}
                      ref={cvPreviewRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>

      </div>

      <div className="lg:hidden">
        <div className="min-h-screen bg-base-100">
          {/* Header Mobile */}
          <div className="navbar bg-primary text-primary-content sticky top-0 z-50 shadow-lg">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl font-bold">
                CV<span className="text-primary-content/80">Builder</span>
              </a>
            </div>
            <div className="flex-none gap-2">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Aperçu</span>
              </button>
              <button 
                onClick={isMobile ? handleMobileDownload : handleDownloadPdf}
                className="btn btn-secondary btn-sm"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-base-200 px-4 py-2">
            <MobileProgressIndicator 
              personalDetails={personalDetails}
              experiences={experiences}
              educations={educations}
              languages={languages}
              skills={skills}
              hobbies={hobbies}
            />
          </div>

          {/* Contenu Mobile */}
          <div className="p-4 space-y-4 pb-24">
            {/* Section Informations Personnelles */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="card-title text-primary">Informations Personnelles</h2>
                    {personalDetails.fullName && (
                      <div className="badge badge-success badge-sm">✓</div>
                    )}
                  </div>
                  <button
                    onClick={handleResetPersonalDetails}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <PersonalDetailsForm
                  personalDetails={personalDetails}
                  setPersonalDetails={setPersonalDetails}
                  setFile={setFile}
                />
              </div>
            </div>

            {/* Section Expériences */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="card-title text-primary">Expériences</h2>
                    {experiences.length > 0 && (
                      <div className="badge badge-primary badge-sm">{experiences.length}</div>
                    )}
                  </div>
                  <button
                    onClick={handleResetExperiences}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <ExperienceForm
                  experience={experiences}
                  setExperiences={setExperience}
                />
                {experiences.length > 0 && (
                  <div className="mt-4">
                    <div className="divider text-sm">Expériences ajoutées</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {experiences.map((exp, index) => (
                        <div key={index} className="alert alert-info alert-sm">
                          <div>
                            <div className="font-bold text-sm">{exp.jobTitle}</div>
                            <div className="text-xs opacity-70">{exp.companyName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Formation */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="card-title text-primary">Formation</h2>
                    {educations.length > 0 && (
                      <div className="badge badge-primary badge-sm">{educations.length}</div>
                    )}
                  </div>
                  <button
                    onClick={handleResetEducations}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <EducationForm
                  educations={educations}
                  setEducations={setEducations}
                />
                {educations.length > 0 && (
                  <div className="mt-4">
                    <div className="divider text-sm">Formations ajoutées</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {educations.map((edu, index) => (
                        <div key={index} className="alert alert-info alert-sm">
                          <div>
                            <div className="font-bold text-sm">{edu.degree}</div>
                            <div className="text-xs opacity-70">{edu.school}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Langues */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="card-title text-primary">Langues</h2>
                    {languages.length > 0 && (
                      <div className="badge badge-primary badge-sm">{languages.length}</div>
                    )}
                  </div>
                  <button
                    onClick={handleResetLanguages}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <LanguageForm
                  languages={languages}
                  setLanguages={setLanguages}
                />
                {languages.length > 0 && (
                  <div className="mt-4">
                    <div className="divider text-sm">Langues ajoutées</div>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {languages.map((lang, index) => (
                        <div key={index} className="flex justify-between items-center bg-base-100 p-2 rounded-lg">
                          <span className="font-semibold text-sm">{lang.language}</span>
                          <span className="badge badge-primary badge-sm">{lang.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Compétences et Loisirs - côte à côte sur mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Section Compétences */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="card-title text-primary text-base">Compétences</h2>
                      {skills.length > 0 && (
                        <div className="badge badge-primary badge-sm">{skills.length}</div>
                      )}
                    </div>
                    <button
                      onClick={handleResetSkills}
                      className="btn btn-primary btn-sm"
                    >
                      <RotateCw className="w-3" />
                    </button>
                  </div>
                  <SkillForm
                    skills={skills}
                    setSkills={setSkills}
                  />
                  {skills.length > 0 && (
                    <div className="mt-4">
                      <div className="divider text-sm">Compétences ajoutées</div>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                        {skills.map((skill, index) => (
                          <div key={index} className="badge badge-outline badge-sm">
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Loisirs */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="card-title text-primary text-base">Loisirs</h2>
                      {hobbies.length > 0 && (
                        <div className="badge badge-primary badge-sm">{hobbies.length}</div>
                      )}
                    </div>
                    <button
                      onClick={handleResetHobbies}
                      className="btn btn-primary btn-sm"
                    >
                      <RotateCw className="w-3" />
                    </button>
                  </div>
                  <HobbyForm
                    hobbies={hobbies}
                    setHobbies={setHobbies}
                  />
                  {hobbies.length > 0 && (
                    <div className="mt-4">
                      <div className="divider text-sm">Loisirs ajoutés</div>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                        {hobbies.map((hobby, index) => (
                          <div key={index} className="badge badge-secondary badge-outline badge-sm">
                            {hobby.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar - Fixe en bas */}
          <div className="fixed bottom-0 left-0 right-0 bg-base-200/95 backdrop-blur-sm border-t border-base-300 p-4 z-40">
            <div className="flex gap-2 max-w-md mx-auto">
              <button 
                className="btn btn-outline flex-1"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
              >
                <Eye className="w-5 h-5" />
                Prévisualiser
              </button>
              <button 
                onClick={isMobile ? handleMobileDownload : handleDownloadPdf}
                className="btn btn-primary flex-1"
              >
                <Save className="w-5 h-5" />
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal pour mobile */}
      <MobileOnboarding 
        isVisible={showOnboarding}
        onClose={() => {
          setShowOnboarding(false)
          localStorage.setItem('cv-builder-onboarding-seen', 'true')
        }}
      />
    </div>
  );
}
