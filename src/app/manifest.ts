
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aravalli Steel',
    short_name: 'Aravalli',
    description: 'Premium Modular Solutions and AI Design Studio',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f15a24',
    icons: [
      {
        src: 'https://picsum.photos/seed/aravalli-logo/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/aravalli-logo/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
