import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  Send, 
  Twitter, 
  Facebook, 
  QrCode 
} from 'lucide-react';
import { MediaItem } from '../types';

interface ShareModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ item, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/#${item.type}/${item.id}`;
  const shareText = `Check out "${item.title}" by ${item.subtitle} on Mtube! 🎵📺`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#131520] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar for mobile */}
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-display font-bold text-base text-white">Share Content</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/5 mb-4">
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-14 h-14 object-cover rounded-xl shrink-0 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
            <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
            <span className="text-[10px] text-rose-400 font-medium uppercase mt-0.5 inline-block">
              {item.type === 'video' ? 'Video Stream' : 'Audio Track'} · {item.durationFormatted}
            </span>
          </div>
        </div>

        {/* Quick Social Action Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 active:scale-95 transition-all"
          >
            <MessageCircle className="w-6 h-6 mb-1 text-emerald-400" />
            <span className="text-[11px] font-medium text-slate-200">WhatsApp</span>
          </button>

          <button
            onClick={handleTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 active:scale-95 transition-all"
          >
            <Twitter className="w-6 h-6 mb-1 text-sky-400" />
            <span className="text-[11px] font-medium text-slate-200">X (Twitter)</span>
          </button>

          <button
            onClick={handleFacebook}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 active:scale-95 transition-all"
          >
            <Facebook className="w-6 h-6 mb-1 text-blue-400" />
            <span className="text-[11px] font-medium text-slate-200">Facebook</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 active:scale-95 transition-all"
          >
            <QrCode className="w-6 h-6 mb-1 text-purple-400" />
            <span className="text-[11px] font-medium text-slate-200">{showQr ? 'Hide QR' : 'QR Code'}</span>
          </button>
        </div>

        {/* QR Code expansion */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-white text-slate-900 text-center mb-4 animate-in zoom-in-95 duration-150">
            <div className="w-36 h-36 mx-auto bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white mb-2">
              <QrCode className="w-24 h-24 text-white" />
              <span className="text-[9px] font-mono mt-1 text-rose-400">SCAN TO WATCH</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Scan with your camera to open on phone</p>
          </div>
        )}

        {/* Link Copy Box */}
        <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-white/[0.05] border border-white/10 mb-3">
          <input 
            type="text" 
            readOnly 
            value={shareUrl}
            className="bg-transparent text-xs text-slate-300 w-full focus:outline-none truncate font-mono"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Native Share button if on mobile */}
        <button
          onClick={handleNativeShare}
          className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Send className="w-4 h-4 text-rose-400" />
          <span>More Sharing Options</span>
        </button>
      </div>
    </div>
  );
};
