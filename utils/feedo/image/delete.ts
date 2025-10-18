export async function deleteImage(formId: string, supabase: any): Promise<boolean> {
    const filePath = `${formId}/icon.jpg`;
    const { error } = await supabase.storage.from("feedo").remove([filePath]);

    if(error){
        return false;
    }

    return true;
}