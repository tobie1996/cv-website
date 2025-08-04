import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from '@/type';

export const personalDetailsPreset: PersonalDetails = {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+123456789',
    address: '123, Avenue Example, Paris, France',
    photoUrl: '/profile.jpg',
    postSeeking:'Chargé de Communication',
    description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'
    
};

export const experiencesPreset: Experience[] = [
    {
        id: 'uuid-1',
        jobTitle: 'Développeur Web',
        companyName: 'Tech Solutions',
        startDate: '2022-01-01',
        endDate: '2023-01-01',
        description: 'Développement d\'applications web en utilisant React et Node.js.'
    },
    {
        id: 'uuid-2',
        jobTitle: 'Chef de projet',
        companyName: 'Innovatech',
        startDate: '2020-06-01',
        endDate: '2022-01-01',
        description: 'Gestion de projets techniques, coordination des équipes de développement.'
    }
];

export const educationsPreset: Education[] = [
    {
        id: 'uuid-3',
        degree: 'Master en Informatique',
        school: 'Edu',
        startDate: '2015-09-01',
        endDate: '2018-06-01',
        description: 'Spécialisation en développement web et bases de données.'
    }
];

export const skillsPreset: Skill[] = [
    { id: 'uuid-4', name: 'React.js' },
    { id: 'uuid-5', name: 'Node.js' }
];

export const languagesPreset: Language[] = [
    { id: 'uuid-6', language: 'Anglais', proficiency: 'Avancé' },
    { id: 'uuid-7', language: 'Français', proficiency: 'Débutant' }
];

export const hobbiesPreset: Hobby[] = [
    { id: 'uuid-8', name: 'Voyager' },
    { id: 'uuid-9', name: 'Lire des livres' }
];
