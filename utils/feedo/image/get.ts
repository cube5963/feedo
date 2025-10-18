export async function getImage(projectId: string, supabase: any): Promise<string | null> {
    const filePath = `${projectId}/icon.jpg`;

    const { data, error } = await supabase
        .storage
        .from("feedo")
        .createSignedUrl(filePath, 60);

    if (error || !data?.signedUrl) {
        return null;
    }

    return `${data.signedUrl}&v=${Date.now()}`;
};