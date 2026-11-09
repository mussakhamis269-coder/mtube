import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Download, 
  Zap, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  Flame
} from 'lucide-react';
import { VipPlan, UserProfile } from '../types';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpgradeSuccess: (plan: VipPlan) => void;
  onOpenAuth: () => void;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradeSuccess,
  onOpenAuth,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<VipPlan>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'airtel'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('+255 712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    if (!user || user.authProvider === 'guest') {
      onOpenAuth();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onUpgradeSuccess(selectedPlan);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const perks = [
    { title: 'Watch Without Ads', desc: 'No pre-rolls, mid-rolls, or banners on videos & music', icon: Zap },
    { title: 'Unlimited Video & Audio Downloads', desc: 'Save KIDANI episodes and songs for 100% offline playback', icon: Download },
    { title: 'Lossless Hi-Fi Audio (320 kbps)', desc: 'Experience punchy deep bass and pristine vocal clarity', icon: Sparkles },
    { title: 'Background & Screen-Off Play', desc: 'Keep listening to music while using other apps or screen locked', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#111320] border-t sm:border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white flex items-center gap-1.5">
                <span>Mtube</span>
                <span className="text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-md text-xs border border-amber-400/30">
                  VIP ACCESS
                </span>
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Pitch */}
        <div className="text-center my-3">
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            Watch Without Ads. Download Everything.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Free users watch with ads. Upgrade to VIP to enjoy uninterrupted KIDANI episodes, unlimited offline downloads, and studio-grade sound.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/20">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{p.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prompt Requirement: VIP Monthly & VIP Yearly Plans */}
        <div className="space-y-2.5 my-4">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400/90 block">
            Choose Your VIP Plan
          </label>

          {/* VIP Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedPlan === 'monthly'
                ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedPlan === 'monthly' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-500'
              }`}>
                {selectedPlan === 'monthly' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">VIP Monthly</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono text-slate-300">
                    Cancel Anytime
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Ad-free music & video + offline downloads</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-base font-extrabold text-amber-400 font-mono">$2.99</div>
              <div className="text-[10px] text-slate-500 font-mono">TZS 5,000 / mo</div>
            </div>
          </div>

          {/* VIP Yearly Plan */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex items-center justify-between ${
              selectedPlan === 'yearly'
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/40'
                : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
              SAVE 30% · BEST VALUE
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedPlan === 'yearly' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-500'
              }`}>
                {selectedPlan === 'yearly' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">VIP Yearly</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    2 MONTHS FREE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">12 months uninterrupted streaming</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-base font-extrabold text-amber-400 font-mono">$24.99</div>
              <div className="text-[10px] text-slate-500 font-mono">TZS 45,000 / yr</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Select Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mpesa', label: 'M-Pesa / Tigo', icon: Smartphone },
              { id: 'card', label: 'Visa / Mastercard', icon: CreditCard },
              { id: 'airtel', label: 'Airtel Money', icon: Smartphone },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === m.id
                    ? 'bg-amber-400/10 border-amber-400/50 text-white'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <m.icon className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span className="text-[10px] font-semibold block">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Success confirmation */}
        {isSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center mb-4 animate-in zoom-in-95">
            <Check className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
            <h4 className="text-sm font-bold text-white">VIP Activated Successfully!</h4>
            <p className="text-xs text-slate-300 mt-0.5">Enjoy ad-free streaming and unlimited downloads.</p>
          </div>
        )}

        {/* Prompt Requirement: Gold Color VIP Button */}
        {!isSuccess && (
          <div>
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Activating VIP Access...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-current text-slate-950" />
                  <span>
                    Get {selectedPlan === 'monthly' ? 'VIP Monthly ($2.99)' : 'VIP Yearly ($24.99)'}
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500 mt-2.5">
              Instant activation. 7-day money-back guarantee. Cancel anytime in Settings.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
