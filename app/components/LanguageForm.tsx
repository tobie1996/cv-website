import { Language } from '@/type';
import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react'

type Props = {
    languages: Language[];
    setLanguages: (languages: Language[]) => void;
}

const LanguageForm: React.FC<Props> = ({ languages, setLanguages }) => {
    const [worldLanguages, setWorldLanguages] = useState<{code: string, name: string}[]>([]);
    const [loading, setLoading] = useState(true);

    const [newLanguage, setNewLanguage] = useState<Language>(
        {
            language: '',
            proficiency: ''
        }
    )

    // Récupérer les langues du monde au montage du composant
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                // Utilisation de l'API REST Countries pour récupérer les langues
                const response = await fetch('https://restcountries.com/v3.1/all?fields=languages');
                const countries = await response.json();
                
                // Extraire toutes les langues uniques
                const languagesSet = new Set<string>();
                countries.forEach((country: { languages?: Record<string, string> }) => {
                    if (country.languages) {
                        Object.values(country.languages).forEach((lang: string) => {
                            if (typeof lang === 'string') {
                                languagesSet.add(lang);
                            }
                        });
                    }
                });
                
                // Convertir en tableau et trier alphabétiquement
                const sortedLanguages = Array.from(languagesSet)
                    .sort()
                    .map((lang, index) => ({
                        code: `lang_${index}`,
                        name: lang
                    }));
                
                setWorldLanguages(sortedLanguages);
            } catch (error) {
                console.error('Erreur lors du chargement des langues:', error);
                // Langues de fallback si l'API ne fonctionne pas
                const fallbackLanguages = [
                    { code: 'fr', name: 'Français' },
                    { code: 'en', name: 'Anglais' },
                    { code: 'es', name: 'Espagnol' },
                    { code: 'de', name: 'Allemand' },
                    { code: 'it', name: 'Italien' },
                    { code: 'pt', name: 'Portugais' },
                    { code: 'ru', name: 'Russe' },
                    { code: 'ja', name: 'Japonais' },
                    { code: 'ko', name: 'Coréen' },
                    { code: 'zh', name: 'Chinois' },
                    { code: 'ar', name: 'Arabe' },
                    { code: 'hi', name: 'Hindi' }
                ];
                setWorldLanguages(fallbackLanguages);
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Language) => {
        setNewLanguage({ ...newLanguage, [field]: e.target.value })
    }

    const handleAddLanguage = () => {
        if (newLanguage.language && newLanguage.proficiency) {
            setLanguages([...languages, newLanguage])
            setNewLanguage(
                {
                    language: '',
                    proficiency: ''
                }
            )
        }
    }

    return (
        <div className='space-y-4'>
            <select
                value={newLanguage.language}
                onChange={(e) => handleChange(e, 'language')}
                className='select select-bordered w-full'
                disabled={loading}
            >
                <option value="">
                    {loading ? 'Chargement des langues...' : 'Sélectionner une langue'}
                </option>
                {worldLanguages.map((lang) => (
                    <option key={lang.code} value={lang.name}>
                        {lang.name}
                    </option>
                ))}
            </select>
            
            <select
                value={newLanguage.proficiency}
                onChange={(e) => handleChange(e, 'proficiency')}
                className='select select-bordered w-full'
            >
                <option value="">Sélectionner la maîtrise</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
            </select>

            <button
                onClick={handleAddLanguage}
                className='btn btn-primary mt-4'
                disabled={!newLanguage.language || !newLanguage.proficiency}
            >
                Ajouter
                <Plus className='w-4' />
            </button>
        </div>
    )
}

export default LanguageForm
