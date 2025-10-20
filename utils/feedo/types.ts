export interface HeaderProps {
    title?: string;
    onBack?: () => void;
    showBackButton?: boolean;
    showNavigation?: boolean;
    showActions?: boolean;
    maxWidth?: number;
}

export interface Section {
    SectionUUID?: string
    FormUUID: string
    SectionName: string
    SectionOrder: number
    SectionType: FormType
    SectionDesc: string
    CreatedAt?: string
    UpdatedAt?: string
    Delete?: boolean
}

export type FormType = "radio" | "checkbox" | "text" | "star" | "two_choice" | "slider"

export interface FormProps {
    initialSections?: Section[]
    formId?: string
    hideFormSelector?: boolean
    supabase?: any
}

export interface FormSelectorProps {
    availableFormIds: string[]
    currentFormId: string | null
    onFormChange: (formId: string) => void
    onCreateNew: () => void
    loading: boolean
}

export interface OptionEditorProps {
    options: string[]
    onUpdate: (options: string[]) => void
    onSave: (newDesc: string) => void
    sectionType: FormType
}

export interface SectionCreatorProps {
    currentFormId: string | null
    onSave: (sectionData: Omit<Section, 'SectionUUID' | 'CreatedAt' | 'UpdatedAt'>) => Promise<void>
    loading: boolean
    sectionsCount: number
    hideAddButton?: boolean
}

export interface SectionCreatorRef {
    resetForm: () => void
}

export interface SectionEditorProps {
    section: Section
    onUpdate: (sectionId: string, updatedSection: Partial<Section>) => void
}

export interface SectionListProps {
    sections: Section[]
    currentFormId: string | null
    onDelete: (id: string) => void
    onUpdate: (sectionId: string, updatedSection: Partial<Section>) => void
    onReorder: (event: any) => void
}

export interface SortableSectionProps {
    section: Section
    onDelete: (id: string) => void
    onUpdate: (sectionId: string, updatedSection: Partial<Section>) => void
}

export interface SliderSettings {
    min: number
    max: number
    divisions: number
    labels: { min: string; max: string }
}

export interface SliderEditorProps {
    settings: SliderSettings
    onUpdate: (settings: SliderSettings) => void
    onSave: (newDesc: string) => void
}

export interface StarEditorProps {
    starCount: number
    options: string[]
    onUpdate: (count: number, options: string[]) => void
    onSave: (newDesc: string) => void
}