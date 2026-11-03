import { ScrapbookData, VideoMomentItem, CouponItem } from '../types/scrapbook';
import { DEFAULT_SCRAPBOOK_DATA } from './defaultData';

/**
 * Utility to encode and decode user customizations into a shareable URL hash.
 * This guarantees that when a link is shared with another person, the other
 * person's browser automatically sees all custom names, passcodes, love letters,
 * video captions, and soul wishes instead of empty defaults.
 */

// Safe Base64 UTF-8 encoding
export function encodeSharePayload(data: ScrapbookData): string {
  try {
    // Extract only customized fields (skip giant local blobs)
    const payload: Partial<ScrapbookData> = {
      recipientName: data.recipientName,
      senderName: data.senderName,
      passcode: data.passcode,
      passcodeHint: data.passcodeHint,
      welcomeMessage: data.welcomeMessage,
      cakeWish: data.cakeWish,
      letterHeading: data.letterHeading,
      letterDate: data.letterDate,
      letterContent: data.letterContent,
      catSecretMessage: data.catSecretMessage,
      favMomentsHeading: data.favMomentsHeading,
      videoTitle: data.videoTitle,
      videoCaption: data.videoCaption,
      videoDate: data.videoDate,
      // Only keep video URL if it's an online URL, not a local blob
      videoUrl: data.videoUrl?.startsWith('blob:') ? '' : data.videoUrl,
      videoMoments: (data.videoMoments || []).map(m => ({
        ...m,
        videoUrl: m.videoUrl?.startsWith('blob:') ? '' : m.videoUrl,
      })),
      finalHeading: data.finalHeading,
      finalMessage: data.finalMessage,
      finalEnding: data.finalEnding,
      coupons: data.coupons,
      musicTitle: data.musicTitle,
      musicArtist: data.musicArtist,
      // If photo is a regular URL or reasonably sized (< 150KB), keep it
      letterPhotoUrl: data.letterPhotoUrl && data.letterPhotoUrl.length < 150000 ? data.letterPhotoUrl : undefined,
    };

    const json = JSON.stringify(payload);
    // UTF-8 to Base64
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (err) {
    console.error('Failed to encode share payload:', err);
    return '';
  }
}

// Decode Base64 UTF-8 payload from URL hash
export function decodeSharePayload(hashString: string): Partial<ScrapbookData> | null {
  try {
    // Find bday= or data=
    const match = hashString.match(/[#&]?(?:bday|data)=([^&]+)/);
    if (!match || !match[1]) return null;

    const encoded = decodeURIComponent(match[1]);
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    return parsed;
  } catch (err) {
    console.error('Failed to decode share payload:', err);
    return null;
  }
}

// Build full shareable URL
export function buildPersonalizedShareUrl(data: ScrapbookData): string {
  const baseOrigin = window.location.origin.includes('run.app')
    ? window.location.origin.replace('ais-dev-', 'ais-pre-')
    : window.location.origin + window.location.pathname;

  const encodedPayload = encodeSharePayload(data);
  if (!encodedPayload) {
    return baseOrigin;
  }
  return `${baseOrigin}#bday=${encodedPayload}`;
}
