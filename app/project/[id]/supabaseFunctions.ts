import { createClient } from '@/utils/supabase/client'
import projectId from '@/app/project/[id]/page'




const supabase = createClient()




export const uploadImage = async (projectId: string, file: File): Promise<string | null> => {
 const supabase = createClient();
 const filePath = `${projectId}/icon.jpg`;


 // 古いファイル削除（任意）
 await supabase.storage.from("feedo").remove([filePath]);


 const { error: uploadError } = await supabase
   .storage
   .from("feedo")
   .upload(filePath, file, {
     upsert: true,
   });


 if (uploadError) {
   console.error("画像アップロード失敗:", uploadError);
   return null;
 }


 // キャッシュバスター付きの public URL を返す
 const { data } = supabase.storage.from("feedo").getPublicUrl(filePath);
 return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
};




export const getImage = async (projectId: string): Promise<string | null> => {
 const supabase = createClient();
 const filePath = `${projectId}/icon.jpg`;


 const { data, error } = await supabase
   .storage
   .from("feedo")
   .createSignedUrl(filePath, 60); // 署名付きURL（60秒間有効）


 if (error || !data?.signedUrl) {
   return null;
 }


 // ✅ 毎回違うURLになるのでキャッシュされない
 return `${data.signedUrl}&v=${Date.now()}`;
};


