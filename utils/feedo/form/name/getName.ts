export async function getFormName(formId:string, supabase:any):Promise<string | null> {
    try {
        const {data, error} = await supabase
            .from('Form')
            .select('FormName')
            .eq('FormUUID', formId)
            .eq('Delete', false)
            .single()

        if (error || !data) {
            console.error(error)
            return null
        }

        return data.FormName
    } catch (error) {
        return null
    }
}