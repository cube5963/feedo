export async function updateFormMessage(formId:string, message:string, supabase: any):Promise<boolean>{
    try {
        const {error} = await supabase
            .from('Form')
            .update({FormMessage: message, UpdatedAt: new Date().toISOString()})
            .eq('FormUUID', formId)
            .eq('Delete', false)

        if (error) {
            console.error('フォームメッセージ更新エラー:', error)
            return false
        }

        return true
    } catch (error) {
        return false
    }
}