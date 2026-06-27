// src/lib/getSeoData.ts



export async function getSeoData(){
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/website-settings`,
      {
        // next: { revalidate: 3600 }, // 1 ঘণ্টা cache
             next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;

    const data= await res.json();
    return data;
  } catch {
    return null;
  }
}