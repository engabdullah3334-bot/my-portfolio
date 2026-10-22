/**
 * Safely parses YouTube and Vimeo URLs into privacy-enhanced embed links.
 */
const okId = s => /^[\w-]{6,20}$/.test(s || '');

export function videoEmbed(raw) {
  if (!raw) return null;
  try {
    const u = new URL(String(raw).trim());
    if (u.protocol !== 'https:') return null;
    const h = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
    const parts = u.pathname.split('/').filter(Boolean);

    if (h === 'youtu.be') {
      return okId(parts[0]) ? `https://www.youtube-nocookie.com/embed/${parts[0]}` : null;
    }

    if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
      let id = u.searchParams.get('v');
      if (!id && ['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
        id = parts[1];
      }
      return okId(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (h === 'vimeo.com' || h === 'player.vimeo.com') {
      const id = parts.find(x => x !== '' && !isNaN(Number(x)));
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* Invalid URL format */
  }
  return null;
}
