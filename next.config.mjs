/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // L'ancienne page « Projets Data » est fusionnee dans /projects, classee par axe.
  async redirects() {
    return [{ source: '/data-projects', destination: '/projects', permanent: true }]
  },
 
}

export default nextConfig