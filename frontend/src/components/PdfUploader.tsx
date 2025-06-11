import { useState, type ChangeEvent } from 'react';

export function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const upload = async () => {
    if (!file) {
      setMessage('No file selected');
      return;
    }
    setUploading(true);
    try {
      // Read as base64
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const b64 = (reader.result as string).split(',', 2)[1];
          resolve(b64);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      const resp = await fetch('http://localhost:3000/search/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: file.name, data }),
      });

      if (!resp.ok) {
        throw new Error(`Upload failed: ${resp.statusText}`);
      }
      const body = await resp.json();
      setMessage(`Indexed with ID ${body.indexed}`);
    } catch (err: unknown) {
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      <button onClick={upload} disabled={!file || uploading}>
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}