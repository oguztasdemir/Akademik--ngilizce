import React from 'react';
import { ShoppingBag, Award, Zap, HelpCircle } from 'lucide-react';

const VirtualShop = ({ 
  activeTab, 
  gems, 
  setGems, 
  ownedOutfits, 
  setOwnedOutfits, 
  activeOutfits, 
  setActiveOutfits,
  streakFreezeActive,
  setStreakFreezeActive
}) => {
  if (activeTab !== 'shop') return null;

  const shopItems = [
    {
      id: 'streak_freeze',
      title: 'Seri Dondurucu',
      description: 'Çalışmayı kaçırdığın bir günde çalışma serini sıfırlanmaktan korur.',
      cost: 100,
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      type: 'powerup'
    },
    {
      id: 'glasses',
      title: 'Bilge Gözlüğü',
      description: 'Baykuşunuzun daha entelektüel görünmesini sağlayan yuvarlak çerçeveli gözlük.',
      cost: 150,
      icon: <Award className="h-6 w-6 text-blue-400" />,
      type: 'cosmetic'
    },
    {
      id: 'robe',
      title: 'Mezuniyet Cübbesi',
      description: 'Akademisyen baykuşunuza yakışacak şık bir mezuniyet cübbesi.',
      cost: 250,
      icon: <ShoppingBag className="h-6 w-6 text-purple-400" />,
      type: 'cosmetic'
    },
    {
      id: 'crown',
      title: 'Kraliyet Tacı',
      description: 'Soruları taçlandırmak isteyen baykuşunuz için parıldayan altın taç.',
      cost: 350,
      icon: <HelpCircle className="h-6 w-6 text-amber-400" />,
      type: 'cosmetic'
    }
  ];

  const handleBuyItem = (item) => {
    if (gems < item.cost) {
      alert("Yetersiz Kristal! Soru çözerek kristal kazanabilirsiniz.");
      return;
    }

    setGems(prev => prev - item.cost);
    localStorage.setItem('yokdil_gems', (gems - item.cost).toString());

    if (item.id === 'streak_freeze') {
      setStreakFreezeActive(true);
      localStorage.setItem('yokdil_streak_freeze', 'true');
      alert("Seri Dondurucu satın alındı! Seriniz bir günlüğüne güvence altında.");
    } else {
      const newOwned = [...ownedOutfits, item.id];
      setOwnedOutfits(newOwned);
      localStorage.setItem('yokdil_owned_outfits', JSON.stringify(newOwned));
      alert(`Tebrikler! ${item.title} gardırobunuza eklendi.`);
    }
  };

  const handleToggleOutfit = (id) => {
    const isActive = activeOutfits.includes(id);
    let newActive;
    if (isActive) {
      newActive = activeOutfits.filter(item => item !== id);
    } else {
      newActive = [...activeOutfits, id];
    }
    setActiveOutfits(newActive);
    localStorage.setItem('yokdil_active_outfits', JSON.stringify(newActive));
  };

  return (
    <div className="space-y-4 text-left">
      <div className="section-title flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Sanal Dükkan 💎</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kazandığınız kristalleri harcayarak koruma alın ve baykuşunuzu giydirin.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <i className="fa-solid fa-gem text-indigo-400"></i>
          <span style={{ fontWeight: '800', color: 'var(--primary-light)', fontSize: '0.9rem' }}>{gems} Kristal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {shopItems.map(item => {
          const isOwned = item.id === 'streak_freeze' ? streakFreezeActive : ownedOutfits.includes(item.id);
          const isEquipped = item.type === 'cosmetic' && activeOutfits.includes(item.id);

          return (
            <div key={item.id} className="glass-card p-4 border border-white/5 bg-white/1 rounded-2xl flex flex-col justify-between" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>{item.description}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fa-solid fa-gem text-indigo-400" style={{ fontSize: '0.75rem' }}></i>
                  <span style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-main)' }}>{item.cost}</span>
                </div>

                {isOwned ? (
                  item.type === 'cosmetic' ? (
                    <button
                      onClick={() => handleToggleOutfit(item.id)}
                      className={`px-3.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                        isEquipped 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-white/5 border-white/5 text-slate-300'
                      }`}
                    >
                      {isEquipped ? 'Çıkar' : 'Giydir'}
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                      Aktif
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => handleBuyItem(item)}
                    className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
                  >
                    Satın Al
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualShop;
