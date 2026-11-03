import React, { useState } from 'react';
import { X, Copy, Check, Share2, Heart, Sparkles, MessageCircle, Send, Key, ExternalLink, FileText } from 'lucide-react';
import { ScrapbookData } from '../types/scrapbook';
import { romanticAudio } from '../utils/audioSynth';
import { fireSurpriseConfetti } from '../utils/confetti';
import { buildPersonalizedShareUrl } from '../utils/shareEncoder';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ScrapbookData;
  passcode: string;
  recipientName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data,
  passcode,
  recipientName,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  // Build the link containing all customizations encoded in the URL hash
  const shareUrl = buildPersonalizedShareUrl(data);

  const shareText = `🎁 A special romantic birthday surprise for ${recipientName}! Open this sweet scrapbook: ${shareUrl} (Secret Passcode: ${passcode}) ❤️`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    romanticAudio.playSparkleChime();
    fireSurpriseConfetti();
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopySummary = () => {
    const summary = JSON.stringify({
      recipientName: data.recipientName,
      senderName: data.senderName,
      passcode: data.passcode,
      passcodeHint: data.passcodeHint,
      welcomeMessage: data.welcomeMessage,
      cakeWish: data.cakeWish,
      letterHeading: data.letterHeading,
      letterContent: data.letterContent,
      finalHeading: data.finalHeading,
      finalMessage: data.finalMessage,
      finalEnding: data.finalEnding,
    }, null, 2);

    navigator.clipboard?.writeText(summary);
    setCopiedSummary(true);
    romanticAudio.playSparkleChime();
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Birthday Scrapbook Surprise for ${recipientName}`,
          text: `A special romantic birthday surprise with love notes, music, and memories! Secret Code: ${passcode}`,
          url: shareUrl,
        });
      } catch (e) {
        // user cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleOpenPreview = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 text-center overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Washi Tape */}
        <div className="w-36 h-5 washi-tape-pink -rotate-1 mx-auto mb-3" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500 text-white mb-3 shadow-md animate-bounce">
          <Share2 className="w-7 h-7" />
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="text-2xl font-serif-romantic font-bold text-rose-950">
            Share Your Personalized Scrapbook! 💌
          </h3>
          <p className="text-xs font-cute text-pink-700">
            Send this special link so {recipientName} opens your exact custom words, letter, and wishes!
          </p>
        </div>

        {/* Customization Status Badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-left mb-4 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed font-cute">
            <span className="font-bold block text-emerald-950">
              ✨ Your Personalized Template is Packed in This Link!
            </span>
            Includes your custom names, secret passcode (<span className="font-mono font-bold">{passcode}</span>), your love letter, and your custom Birthday Wish from Soul.
          </div>
        </div>

        {/* URL Box */}
        <div className="bg-pink-50/80 rounded-2xl p-3 border border-pink-200 text-left my-3 space-y-2">
          <span className="text-[10px] font-cute font-bold text-pink-800 uppercase tracking-wider block">
            Your Personalized Shareable Link:
          </span>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-pink-200">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="text-xs font-mono text-rose-900 bg-transparent flex-1 select-all outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-cute font-bold shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Passcode Reminder Card */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs font-cute text-rose-900 mb-4">
          <div className="flex items-center gap-2 text-left">
            <Key className="w-4 h-4 text-rose-600" />
            <span>Secret Entry Code:</span>
          </div>
          <span className="font-mono font-bold text-sm bg-white px-2.5 py-0.5 rounded-md border border-rose-200 text-rose-600 tracking-wider">
            {passcode}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-cute font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                <span>Personalized Link Copied to Clipboard! 🎉</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Personalized Link (Ready to Send)</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-cute font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleOpenPreview}
              className="py-2.5 px-3 rounded-xl bg-pink-100 hover:bg-pink-200 text-rose-900 font-cute font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-rose-600" />
              <span>Test Preview Link</span>
            </button>
          </div>

          {/* Chat Backup Option */}
          <div className="mt-3 pt-3 border-t border-pink-100 text-left">
            <p className="text-[11px] text-pink-700 font-cute mb-1.5">
              Want your custom words hardcoded as the permanent website default?
            </p>
            <button
              onClick={handleCopySummary}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-cute font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Custom Words Copied! (Paste it in AI Studio chat)</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Copy Custom Words to Paste in Chat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
