export async function getFirstSection(formId:string, supabase:any): Promise<string| null> {
    try {
        // 最初の質問を取得
        const {data: sections, error} = await supabase
            .from('Section')
            .select('SectionUUID')
            .eq('FormUUID', formId)
            .eq('Delete', false)
            .order('SectionOrder', {ascending: true})
            .limit(1)

        if (error || !sections || sections.length === 0) {
            return null
        }

        return sections[0].SectionUUID

    } catch (error) {
        return null
    }
}