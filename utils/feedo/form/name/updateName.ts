export async function updateFormName(formId: string, newFormName: string, supabase: any): Promise<boolean> {
    try {
        const {error} = await supabase
            .from('Form')
            .update({FormName: newFormName, UpdatedAt: new Date().toISOString()})
            .eq('FormUUID', formId)
            .eq('Delete', false)

        if (error) {
            console.error('フォーム名更新エラー:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('フォーム名更新エラー:', error)
        return false
    }
}