export async function createForm(user: any, supabase: any): Promise<any | null> {
    try {
        const currentTime = new Date().toISOString(); // ISO 8601形式の現在日時
        const formData = {
            FormName: 'New Form', // デフォルトのフォーム名
            ImgID: '',
            Delete: false,
            UserID: user.id, // ログインユーザーのIDを設定
            CreatedAt: currentTime, // 作成日時を明示的に設定
            UpdatedAt: currentTime  // 最終更新日時を作成日時と同じに設定
        };

        const {data: newForm, error: createError} = await supabase
            .from('Form')
            .insert([formData])
            .select()
            .single();

        if (createError) {
            console.error('フォーム作成エラー:', createError);
            alert(`フォームの作成に失敗しました: ${createError.message}`);
            return null;
        }

        if (newForm) {
            return newForm;
        }
    } catch (error: any) {
        console.error('フォーム作成エラー詳細:', error);
        return null;
    }
}