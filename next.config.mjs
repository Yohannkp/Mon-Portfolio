/** @type {import('next').NextConfig} */
const nextConfig = {
  // L'ancienne page « Projets Data » est fusionnee dans /projects, classee par axe.
  async redirects() {
    return [{ source: '/data-projects', destination: '/projects', permanent: true }]
  },
 
}

export default nextConfig