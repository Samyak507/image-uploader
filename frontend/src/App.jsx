import React, { useEffect, useState, useRef } from 'react'
import { listImages, uploadImage, fetchImageUrl, deleteImage } from './api'


export default function App() {
  const [images, setImages] = useState([])
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()


  useEffect(() => { load() }, [])
  async function load() {
    const imgs = await listImages()
    setImages(imgs)
  }


  async function handleChoose(e) {
    const f = e.target.files[0]
    if (!f) return
    // client-side validation
    if (!['image/png', 'image/jpeg'].includes(f.type)) { alert('Only PNG/JPEG allowed'); return }
    if (f.size > 3 * 1024 * 1024) { alert('File too large (max 3MB)'); return }


    setUploading(true); setProgress(0)
    try {
      const res = await uploadImage(f, (p) => setProgress(p))
      // add new image to state with its id and filename
      setImages(prev => [{ id: res.id, filename: res.filename, mimetype: res.mimetype }, ...prev])
    } catch (err) {
      alert(err.error || 'Upload failed')
    } finally {
      setUploading(false); setProgress(0); fileRef.current.value = null
    }
  }


  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return
    try {
      await deleteImage(id)
      setImages(prev => prev.filter(i => i.id !== id))
    } catch (e) { alert('Delete failed') }
  }


  return (
    <div className="container">
      <h1>Mini Image Gallery</h1>


      <div className="uploader">
        <input ref={fileRef} type="file" accept="image/png, image/jpeg" onChange={handleChoose} />
        {uploading && <div className="progress">Uploading: {progress}%</div>}
      </div>


      <div className="grid">
        {images.length === 0 && <p>No images yet. Upload one (max 3 MB).</p>}
        {images.map(img => (
          <figure key={img.id} className="card">
            <img src={fetchImageUrl(img.id)} alt={img.filename} />
            <figcaption>
              <span className="name">{img.filename}</span>
              <button className="del" onClick={() => handleDelete(img.id)}>Delete</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
