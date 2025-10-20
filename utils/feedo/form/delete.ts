export async function deleteForm(formId: string, supabase: any): Promise<boolean> {
    const {error: sectionError } = await supabase.from("Section").delete().eq('FormUUID', formId)

    if(sectionError){
        alert(`セクションの削除に失敗しました: ${sectionError.message}`);
        return false;
    }

    const {error: deleteError} = await supabase.from('Form').update({Delete: true}).eq('FormUUID',formId)

    if (deleteError) {
        alert(`フォームの削除に失敗しました: ${deleteError.message}`);
        return false;
    }

    return true
}