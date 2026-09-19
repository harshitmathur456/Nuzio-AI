import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Check Vercel Edge Geo headers
  const vercelCity = request.headers.get('x-vercel-ip-city');
  const vercelRegion = request.headers.get('x-vercel-ip-country-region');
  const vercelCountry = request.headers.get('x-vercel-ip-country');

  if (vercelCity) {
    const cleanCity = decodeURIComponent(vercelCity);
    const cleanRegion = vercelRegion ? decodeURIComponent(vercelRegion) : '';
    const formatted = `${cleanCity}${cleanRegion ? `, ${cleanRegion}` : ''} (Hyperlocal active)`;
    return NextResponse.json({
      city: cleanCity,
      region: cleanRegion,
      country: vercelCountry || 'India',
      formatted,
    });
  }

  // 2. IP Geolocation query (for localhost development and direct access)
  try {
    const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.city) {
        const formatted = `${data.city}, ${data.region || data.country || 'India'} (Hyperlocal active)`;
        return NextResponse.json({
          city: data.city,
          region: data.region || 'India',
          country: data.country || 'India',
          formatted,
        });
      }
    }
  } catch (err) {
    console.warn('ipwho.is query failed:', err);
  }

  // 3. Secondary fallback: bigdatacloud reverse-geocode
  try {
    const bdcRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en', { cache: 'no-store' });
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const city = bdcData.city || bdcData.locality;
      if (city) {
        const formatted = `${city}, ${bdcData.principalSubdivision || 'India'} (Hyperlocal active)`;
        return NextResponse.json({
          city,
          region: bdcData.principalSubdivision || 'India',
          country: bdcData.countryName || 'India',
          formatted,
        });
      }
    }
  } catch (err) {
    console.warn('bigdatacloud query failed:', err);
  }

  // 4. Default fallback
  return NextResponse.json({
    city: 'Jodhpur',
    region: 'Rajasthan',
    country: 'India',
    formatted: 'Jodhpur, Rajasthan (Hyperlocal active)',
  });
}
