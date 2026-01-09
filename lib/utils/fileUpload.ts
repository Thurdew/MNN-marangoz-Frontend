import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveFile(file: File): Promise<string> {
  await ensureUploadDir();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = file.name.split('.').pop();
  const filename = `${timestamp}-${randomString}.${ext}`;

  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}

export async function saveMultipleFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => saveFile(file));
  return Promise.all(uploadPromises);
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Geçersiz dosya tipi. Sadece JPEG, PNG, WebP ve GIF kabul edilir' };
  }

  return { valid: true };
}
