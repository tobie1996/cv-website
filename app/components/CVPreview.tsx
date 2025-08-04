import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from '@/type';
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { BriefcaseBusiness, GraduationCap, Mail, MapPinCheckInside, Phone, Star, Calendar, User } from 'lucide-react';

type Props = {
    personalDetails: PersonalDetails;
    file: File | null;
    theme: string;
    experiences: Experience[];
    educations: Education[];
    languages: Language[];
    skills: Skill[];
    hobbies: Hobby[];
    download?: boolean;
    ref?: any
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

const getStarRating = (proficiency: string) => {
    const maxStars = 5;
    let filledStars = 0;

    switch (proficiency) {
        case 'Débutant':
            filledStars = 1;
            break;
        case 'Intermédiaire':
            filledStars = 3;
            break;
        case 'Avancé':
            filledStars = 5;
            break;
        default:
            filledStars = 0;
    }
    return (
        <div className="flex gap-1">
            {Array.from({ length: filledStars }, (_, index) => (
                <Star key={index} className="w-4 h-4 fill-primary text-primary" />
            ))}
            {Array.from({ length: maxStars - filledStars }, (_, index) => (
                <Star key={index + filledStars} className="w-4 h-4 text-gray-300" />
            ))}
        </div>
    );
}

// Fonction pour diviser le contenu en pages
const paginateContent = (experiences: Experience[], educations: Education[], itemsPerPage = 3) => {
    const pages = [];
    let currentPageExperiences: Experience[] = [];
    let currentPageEducations: Education[] = [];
    
    // Première page avec expériences
    if (experiences.length > 0) {
        const firstPageExperiences = experiences.slice(0, itemsPerPage);
        pages.push({
            experiences: firstPageExperiences,
            educations: [],
            isFirstPage: true
        });
        
        // Pages suivantes pour les expériences restantes
        for (let i = itemsPerPage; i < experiences.length; i += itemsPerPage) {
            pages.push({
                experiences: experiences.slice(i, i + itemsPerPage),
                educations: [],
                isFirstPage: false
            });
        }
    }
    
    // Pages pour les formations
    if (educations.length > 0) {
        for (let i = 0; i < educations.length; i += itemsPerPage) {
            pages.push({
                experiences: [],
                educations: educations.slice(i, i + itemsPerPage),
                isFirstPage: pages.length === 0
            });
        }
    }
    
    // Si aucun contenu, créer au moins une page
    if (pages.length === 0) {
        pages.push({
            experiences: [],
            educations: [],
            isFirstPage: true
        });
    }
    
    return pages;
};

const CVPreview: React.FC<Props> = ({ 
    personalDetails, 
    file, 
    theme, 
    experiences, 
    educations, 
    languages, 
    skills, 
    hobbies, 
    download, 
    ref 
}) => {
    const pages = paginateContent(experiences, educations);

    const SidebarContent = ({ showOnFirstPageOnly = false, pageIndex = 0 }) => (
        <div className={`w-1/3 bg-gradient-to-b from-gray-50 to-gray-100 p-8 ${showOnFirstPageOnly && pageIndex > 0 ? 'opacity-30' : ''}`}>
            {/* Photo de profil - uniquement sur la première page */}
            {pageIndex === 0 && (
                <div className='mb-8 flex justify-center'>
                    <div className='w-48 h-48 rounded-full border-4 border-primary shadow-xl overflow-hidden bg-white'>
                        {file ? (
                            <Image
                                src={URL.createObjectURL(file)}
                                width={200}
                                height={200}
                                className='w-full h-full object-cover'
                                alt="Photo de profil"
                                onLoadingComplete={() => {
                                    if (typeof file !== 'string') {
                                        URL.revokeObjectURL(URL.createObjectURL(file))
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Informations de contact */}
            <div className='mb-8'>
                <h2 className='text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary uppercase tracking-wide'>
                    Contact
                </h2>
                <div className='space-y-4'>
                    {personalDetails.phone && (
                        <div className='flex items-center space-x-3 group'>
                            <Phone className='w-5 h-5 text-primary flex-shrink-0' />
                            <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                                {personalDetails.phone}
                            </span>
                        </div>
                    )}
                    {personalDetails.email && (
                        <div className='flex items-center space-x-3 group'>
                            <Mail className='w-5 h-5 text-primary flex-shrink-0' />
                            <span className='text-sm text-gray-700 group-hover:text-primary transition-colors break-all'>
                                {personalDetails.email}
                            </span>
                        </div>
                    )}
                    {personalDetails.address && (
                        <div className='flex items-center space-x-3 group'>
                            <MapPinCheckInside className='w-5 h-5 text-primary flex-shrink-0' />
                            <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                                {personalDetails.address}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Compétences */}
            {skills.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary uppercase tracking-wide'>
                        Compétences
                    </h2>
                    <div className='flex flex-wrap gap-2'>
                        {skills.map((skill, index) => (
                            <span 
                                key={index} 
                                className='bg-primary text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide shadow-sm hover:shadow-md transition-shadow'
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Langues */}
            {languages.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary uppercase tracking-wide'>
                        Langues
                    </h2>
                    <div className='space-y-4'>
                        {languages.map((lang, index) => (
                            <div key={index} className='bg-white p-3 rounded-lg shadow-sm'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='font-semibold text-gray-800 capitalize'>
                                        {lang.language}
                                    </span>
                                    <span className='text-xs text-gray-500 uppercase'>
                                        {lang.proficiency}
                                    </span>
                                </div>
                                {getStarRating(lang.proficiency)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hobbies */}
            {hobbies.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary uppercase tracking-wide'>
                        Loisirs
                    </h2>
                    <div className='space-y-2'>
                        {hobbies.map((hobby, index) => (
                            <div key={index} className='bg-white p-2 rounded-lg shadow-sm'>
                                <span className='text-sm text-gray-700 capitalize'>
                                    {hobby.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const PageHeader = ({ isFirstPage, pageNumber }: { isFirstPage: boolean, pageNumber: number }) => (
        <div className={`mb-8 ${isFirstPage ? 'mb-12' : 'mb-8'}`}>
            {isFirstPage ? (
                <div className='bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-lg shadow-xl'>
                    <h1 className='text-2xl font-light mb-2 uppercase tracking-wide'>
                        {personalDetails.fullName}
                    </h1>
                    <h2 className='text-4xl font-bold mb-4 uppercase'>
                        {personalDetails.postSeeking}
                    </h2>
                    {personalDetails.description && (
                        <p className='text-lg leading-relaxed opacity-95'>
                            {personalDetails.description}
                        </p>
                    )}
                </div>
            ) : (
                <div className='border-b-2 border-primary pb-4'>
                    <h1 className='text-xl font-bold text-gray-800 uppercase tracking-wide'>
                        {personalDetails.fullName} - {personalDetails.postSeeking}
                    </h1>
                    <div className='text-sm text-gray-500 mt-1'>
                        Page {pageNumber + 1}
                    </div>
                </div>
            )}
        </div>
    );

    const ExperienceSection = ({ experiences }: { experiences: Experience[] }) => (
        <div className='mb-8'>
            <h2 className='text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-primary uppercase tracking-wide flex items-center'>
                <BriefcaseBusiness className='w-6 h-6 mr-2 text-primary' />
                Expériences Professionnelles
            </h2>
            <div className='space-y-6'>
                {experiences.map((exp, index) => (
                    <div key={index} className='bg-white p-6 rounded-lg shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow'>
                        <div className='flex justify-between items-start mb-3'>
                            <h3 className='text-lg font-bold text-gray-800 uppercase'>
                                {exp.jobTitle}
                            </h3>
                            <div className='flex items-center text-sm text-gray-500'>
                                <Calendar className='w-4 h-4 mr-1' />
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </div>
                        </div>
                        <div className='mb-3'>
                            <span className='bg-primary text-white px-3 py-1 rounded-full text-sm font-medium'>
                                {exp.companyName}
                            </span>
                        </div>
                        {exp.description && (
                            <p className='text-gray-700 leading-relaxed'>
                                {exp.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const EducationSection = ({ educations }: { educations: Education[] }) => (
        <div className='mb-8'>
            <h2 className='text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-primary uppercase tracking-wide flex items-center'>
                <GraduationCap className='w-6 h-6 mr-2 text-primary' />
                Formation
            </h2>
            <div className='space-y-6'>
                {educations.map((edu, index) => (
                    <div key={index} className='bg-white p-6 rounded-lg shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow'>
                        <div className='flex justify-between items-start mb-3'>
                            <h3 className='text-lg font-bold text-gray-800 uppercase'>
                                {edu.degree}
                            </h3>
                            <div className='flex items-center text-sm text-gray-500'>
                                <Calendar className='w-4 h-4 mr-1' />
                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                            </div>
                        </div>
                        <div className='mb-3'>
                            <span className='bg-primary text-white px-3 py-1 rounded-full text-sm font-medium'>
                                {edu.school}
                            </span>
                        </div>
                        {edu.description && (
                            <p className='text-gray-700 leading-relaxed'>
                                {edu.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div ref={ref} className={`${download ? 'mb-10' : ''}`} data-theme={theme}>
            {pages.map((page, pageIndex) => (
                <div 
                    key={pageIndex} 
                    className='flex w-[950px] h-[1200px] bg-white shadow-2xl rounded-lg overflow-hidden mb-8 print:mb-0 print:shadow-none print:rounded-none'
                    style={{ pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto' }}
                >
                    <SidebarContent pageIndex={pageIndex} />
                    
                    <div className='w-2/3 p-8 bg-gray-50/30'>
                        <PageHeader isFirstPage={page.isFirstPage} pageNumber={pageIndex} />
                        
                        <div className='space-y-8'>
                            {page.experiences.length > 0 && (
                                <ExperienceSection experiences={page.experiences} />
                            )}
                            
                            {page.educations.length > 0 && (
                                <EducationSection educations={page.educations} />
                            )}
                        </div>
                        
                        {/* Numéro de page en bas */}
                        <div className='absolute bottom-4 right-8 text-sm text-gray-400'>
                            {pageIndex + 1} / {pages.length}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CVPreview;