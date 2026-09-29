import type { MetadataRoute } from 'next'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://bungko.id'
  let posts: MetadataRoute.Sitemap = []
  try {
    const res = await fetch('https://bungko.id/api-berita.php?limit=100', { cache: 'no-store' })
    const data = await res.json()
    if (Array.isArray(data)) {
      posts = data.map((b: any) => ({
        url: `${base}/berita/${b.slug || b.id}`,
        lastModified: new Date(b.tanggal || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    }
  } catch {}
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/kategori/teknologi`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/kategori/berita`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
   ...posts,
  ]
}
