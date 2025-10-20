export async function uploadImage(formId: string, file: File, supabase: any): Promise<string | null> {
    const filePath = `${formId}/icon.jpg`

    await supabase.storage.from('feedo').remove([filePath])
    const { error } = await supabase.storage.from('feedo').upload(filePath, file, {upsert: true})

    if(error){
        console.error(error)
        return null
    }

    const { data } = supabase.storage.from("feedo").getPublicUrl(filePath)
    return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
}