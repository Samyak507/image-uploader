const API = 'http://localhost:4000';
export async function listImages() {
    const res = await fetch(`${API}/images`);
    return res.json();
}


export function uploadImage(file, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/upload`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(JSON.parse(xhr.responseText || '{"error":"upload failed"}'));
            }
        };
        xhr.onerror = () => reject({ error: 'network error' });
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        const fd = new FormData();
        fd.append('image', file);
        xhr.send(fd);
    });
}


export async function fetchImageUrl(id) {
    return `${API}/images/${id}`; // can be used directly in <img src>
}


export async function deleteImage(id) {
    const res = await fetch(`${API}/images/${id}`, { method: 'DELETE' });
    return res.json();
}