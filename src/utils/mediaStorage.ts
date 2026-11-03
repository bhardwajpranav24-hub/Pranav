/**
 * Client-side media upload helpers for persistent image and audio storage.
 * Handles image downscaling to preserve high quality while staying within local storage quotas,
 * and IndexedDB storage for full audio files.
 */

// Helper: Compress an image file to a data URL (max 1200px, quality 0.82)
export async function fileToOptimizedDataUrl(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG or WebP
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Simple IndexedDB wrapper for large audio files
const DB_NAME = 'RomanticScrapbookDB';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_media';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveAudioToStorage(id: string, file: File): Promise<string> {
  try {
    const db = await openDB();
    const arrayBuffer = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ data: arrayBuffer, type: file.type, name: file.name }, id);
      tx.oncomplete = () => {
        const blob = new Blob([arrayBuffer], { type: file.type });
        const objectUrl = URL.createObjectURL(blob);
        resolve(objectUrl);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB write failed, fallback to ObjectURL:', e);
    return URL.createObjectURL(file);
  }
}

export async function loadAudioFromStorage(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          const blob = new Blob([req.result.data], { type: req.result.type });
          const objectUrl = URL.createObjectURL(blob);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function saveVideoToStorage(id: string, file: File): Promise<string> {
  try {
    const db = await openDB();
    const arrayBuffer = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ data: arrayBuffer, type: file.type, name: file.name }, id);
      tx.oncomplete = () => {
        const blob = new Blob([arrayBuffer], { type: file.type });
        const objectUrl = URL.createObjectURL(blob);
        resolve(objectUrl);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB video write failed, fallback to ObjectURL:', e);
    return URL.createObjectURL(file);
  }
}

export async function loadVideoFromStorage(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          const blob = new Blob([req.result.data], { type: req.result.type });
          const objectUrl = URL.createObjectURL(blob);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

