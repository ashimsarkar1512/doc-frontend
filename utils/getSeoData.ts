// utils/getSeoData.ts

export async function getSeoData() {
  try {
    const apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiUrl) return null;

    const res = await fetch(`${apiUrl}/admin/website-settings`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}
