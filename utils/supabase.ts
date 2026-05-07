import { supabase } from "@/lib/supabase";

const bucketName = "Menu";

export const supabaseService = {
  async uploadImage(imageFile: File) {
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageFile, { upsert: true });
    console.log(error)
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  },
  async deleteImage(fileName: string) {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) throw error;
  },
};
