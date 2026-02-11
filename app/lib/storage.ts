import { v2 as cloudinary } from "cloudinary";

/**
 * Utility to handle image storage.
 * In development, it saves files to the local /public/uploads directory.
 * In production (Vercel), it uses Cloudinary.
 */

export async function uploadImage(file: File): Promise<string> {
  // Validate file
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided");
  }

  // configuration Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;

  // 1. Try Cloudinary (Recommended for Vercel)
  if (isProduction && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "modifai",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload failed:", error);
              reject(new Error("Cloudinary upload failed"));
            } else {
              resolve(result!.secure_url);
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      console.error("Cloudinary storage handler exception:", error);
      throw new Error("Failed to upload to Cloudinary");
    }
  }

  // 2. Fallback to Local Storage (Dev only)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Local storage failed:", error);
    throw new Error("Failed to save file locally");
  }
}
