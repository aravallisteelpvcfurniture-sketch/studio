
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aravalli Steel',
    short_name: 'Aravalli',
    description: 'Premium Modular Solutions and AI Design Studio',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/studio-4892458321-e617b.appspot.com/o/logo.png?alt=media',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/studio-4892458321-e617b.appspot.com/o/logo.png?alt=media',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
