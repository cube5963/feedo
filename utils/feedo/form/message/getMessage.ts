export async function getFormMessage(formId: string, supabase: any): Promise<string | null> {
    try {
        const {data, error} = await supabase
            .from('Form')
            .select('FormMessage')
            .eq('FormUUID', formId)
            .eq('Delete', false)
            .single()

        if (error || !data) {
            console.error('フォームメッセージ取得エラー:', error)
            return null
        }

        return data.FormMessage
    } catch (error) {
        console.error('フォームメッセージ取得エラー:', error)
        return null
    }
}