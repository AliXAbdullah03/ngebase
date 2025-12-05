// File upload helper for MongoDB base64 storage
export async function convertFileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data and mime type from data URI
      const matches = result.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        resolve({
          base64: matches[2], // Just the base64 part
          mimeType: matches[1], // MIME type
        });
      } else {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function createDataURI(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit',
    };
  }

  return { valid: true };
}

