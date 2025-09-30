import { storage } from '../firebase';

export const uploadFile = async (
  path: string,
  file: File | Blob,
  onProgress?: (pct: number) => void
): Promise<string> => {
  const ref = storage.ref().child(path);
  const task = ref.put(file as any);
  return new Promise<string>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot: any) => {
        try {
          const pct = snapshot.totalBytes ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100 : 0;
          onProgress?.(pct);
        } catch (e) {
          // ignore
        }
      },
      (err: any) => reject(err),
      async () => {
        try {
          const url = await ref.getDownloadURL();
          resolve(url);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};
