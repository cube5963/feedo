export function formatSafeDate (dateString: string | null | undefined, fieldName?: string): string {
    if (!dateString) {
        return '不明';
    }

    try {
        // Unix timestamp（秒）の場合は*1000してミリ秒に変換
        let date: Date;

        // 数値の場合（Unix timestamp）
        if (typeof dateString === 'number' || /^\d+$/.test(String(dateString))) {
            const timestamp = Number(dateString);
            // 秒単位のUnix timestampの場合（桁数が少ない）
            if (timestamp < 10000000000) {
                date = new Date(timestamp * 1000);
            } else {
                date = new Date(timestamp);
            }
        } else {
            date = new Date(dateString);
        }

        // 無効な日付や1970年代（Unix timestamp 0近辺）をチェック
        if (isNaN(date.getTime()) || date.getFullYear() < 1990) {
            console.warn(`${fieldName || 'Date'} 無効な日付:`, dateString, '→', date);
            return '不明';
        }

        return date.toLocaleDateString('ja-JP');
    } catch (error) {
        console.error(`${fieldName || 'Date'} フォーマットエラー:`, error, dateString);
        return '不明';
    }
}

// AIフォームの日付を修正する関数
export async function fixAIFormDates (formsToFix: any[],supabase: any): Promise<void>  {
    if (formsToFix.length === 0) return;

    const now = new Date().toISOString();

    for (const form of formsToFix) {
        try {
            const {error: updateError} = await supabase
                .from('Form')
                .update({
                    CreatedAt: form.CreatedAt && new Date(form.CreatedAt).getFullYear() >= 1990
                        ? form.CreatedAt
                        : now,
                    UpdatedAt: now  // 最終更新日は現在時刻に設定
                })
                .eq('FormUUID', form.FormUUID)

            if (updateError) {
                console.error(`フォーム ${form.FormName} の日付更新エラー:`, updateError);
            }
        } catch (error) {
            console.error(`フォーム ${form.FormName} の修正中にエラー:`, error);
        }
    }

    window.location.reload();
}