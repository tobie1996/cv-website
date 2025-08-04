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

  useEffect(() => {
    const defaultImageUrl = '/profile.jpg'
    fetch(defaultImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const defaultFile = new File([blob], "profile.jpg", { type: blob.type })

        setFile(defaultFile)

      })
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

  const cvPreviewRef = useRef(null)

  const handleDownloadPdf = async () => {
    const element = cvPreviewRef.current
    if(element){
      try {

        const canvas = await html2canvas(element , {
          scale : 3,
          useCORS: true,
        })
        const imgData = canvas.toDataURL('image/png')

        const pdf = new jsPDF({
          orientation:"portrait",
          unit:'mm',
          format:"A4"
        })
        
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width 

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`cv.pdf`)

        const modal = document.getElementById('my_modal_3') as HTMLDialogElement
        if(modal){
          modal.close()
        }

        confetti({
             particleCount: 100,
             spread: 70 ,
             origin: {y:0.6},
             zIndex:9999
        })

      } catch (error) {
         console.error('Erreur lors de la génération du PDF :', error);
      }
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

              />
            </div>

          </div>

        </section>




        <dialog id="my_modal_3" className="modal">
          <div className="modal-box w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div className="mt-5">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    {themes.map((themeOption) => (
                      <option key={themeOption} value={themeOption}>
                        {themeOption}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={handleDownloadPdf} className="btn btn-primary btn-sm sm:btn-md">
                  Télécharger
                  <Save className='w-4' />
                </button>
              </div>

              <div className="w-full max-w-full overflow-auto">
                <div className="w-full max-w-full flex justify-center items-center">
                  <div className="transform scale-50 sm:scale-75 lg:scale-100 origin-top">
                    <CVPreview
                      personalDetails={personalDetails}
                      file={file}
                      theme={theme}
                      experiences={experiences}
                      educations={educations}
                      languages={languages}
                      hobbies={hobbies}
                      skills={skills}
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
          <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl font-bold">CV Builder</a>
            </div>
            <div className="flex-none">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
              >
                <Eye className="w-4 h-4" />
                Aperçu
              </button>
            </div>
          </div>

          {/* Contenu Mobile */}
          <div className="p-4 space-y-6">
            {/* Section Informations Personnelles */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-primary">Informations Personnelles</h2>
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
                  <h2 className="card-title text-primary">Expériences</h2>
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
                    <div className="divider">Expériences ajoutées</div>
                    <div className="space-y-2">
                      {experiences.map((exp, index) => (
                        <div key={index} className="alert alert-info">
                          <div>
                            <div className="font-bold">{exp.jobTitle}</div>
                            <div className="text-sm opacity-70">{exp.companyName}</div>
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
                  <h2 className="card-title text-primary">Formation</h2>
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
                    <div className="divider">Formations ajoutées</div>
                    <div className="space-y-2">
                      {educations.map((edu, index) => (
                        <div key={index} className="alert alert-info">
                          <div>
                            <div className="font-bold">{edu.degree}</div>
                            <div className="text-sm opacity-70">{edu.school}</div>
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
                  <h2 className="card-title text-primary">Langues</h2>
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
                    <div className="divider">Langues ajoutées</div>
                    <div className="grid grid-cols-1 gap-2">
                      {languages.map((lang, index) => (
                        <div key={index} className="flex justify-between items-center bg-base-100 p-3 rounded-lg">
                          <span className="font-semibold">{lang.language}</span>
                          <span className="badge badge-primary">{lang.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Compétences */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-primary">Compétences</h2>
                  <button
                    onClick={handleResetSkills}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <SkillForm
                  skills={skills}
                  setSkills={setSkills}
                />
                {skills.length > 0 && (
                  <div className="mt-4">
                    <div className="divider">Compétences ajoutées</div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="badge badge-outline badge-lg">
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
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-primary">Loisirs</h2>
                  <button
                    onClick={handleResetHobbies}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCw className="w-4" />
                  </button>
                </div>
                <HobbyForm
                  hobbies={hobbies}
                  setHobbies={setHobbies}
                />
                {hobbies.length > 0 && (
                  <div className="mt-4">
                    <div className="divider">Loisirs ajoutés</div>
                    <div className="flex flex-wrap gap-2">
                      {hobbies.map((hobby, index) => (
                        <div key={index} className="badge badge-secondary badge-outline badge-lg">
                          {hobby.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton d'aperçu flottant */}
            <div className="fixed bottom-6 right-6 z-40">
              <button 
                className="btn btn-primary btn-circle btn-lg shadow-2xl"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>

            {/* Espacement pour le bouton flottant */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
