import React, { useState, useEffect } from 'react';
import MascotPet, { ANIMAL_CATALOG, ACCESSORY_HATS, ACCESSORY_GLASSES, ACCESSORY_CLOTHES, ACCESSORY_ITEMS } from '../../components/common/MascotPet';

const ROOM_BACKGROUNDS = {
  cozy: {
    name: 'Cozy Oda 🏠',
    style: {
      backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(253,224,71,0.12) 0%, transparent 50%), radial-gradient(circle at 50% 120%, rgba(99,102,241,0.15), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 24px), linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  },
  library: {
    name: '📚 Kütüphane',
    style: {
      backgroundImage: 'linear-gradient(0deg, transparent 48%, rgba(217,119,6,0.1) 49%, rgba(217,119,6,0.1) 52%, transparent 53%), linear-gradient(90deg, transparent 20%, rgba(217,119,6,0.05) 21%, rgba(217,119,6,0.05) 23%, transparent 24%), linear-gradient(135deg, #3b1e11 0%, #150b06 100%)',
      backgroundSize: '100% 100%, 80px 100%, 100% 100%',
      border: '1px solid rgba(217,119,6,0.15)'
    }
  },
  science: {
    name: '🔬 Fen Lab',
    style: {
      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(16,185,129,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.15) 0%, transparent 40%), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(135deg, #062f22 0%, #021a12 100%)',
      backgroundSize: '100% 100%, 100% 100%, 28px 28px, 28px 28px, 100% 100%',
      border: '1px solid rgba(16,185,129,0.2)'
    }
  },
  forest: {
    name: '🌳 Doğal Orman',
    style: {
      backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(250,204,21,0.18) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 90% 85%, rgba(4,120,87,0.2) 0%, transparent 50%), linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      border: '1px solid rgba(16,185,129,0.25)'
    }
  },
  history: {
    name: '🏛️ Antik Harabeler',
    style: {
      backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(251,146,60,0.15) 0%, transparent 75%), repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(251,146,60,0.03) 25px, rgba(251,146,60,0.03) 26px), repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(251,146,60,0.03) 49px, rgba(251,146,60,0.03) 50px), linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)',
      backgroundSize: '100% 100%, 50px 26px, 50px 26px, 100% 100%',
      border: '1px solid rgba(251,191,36,0.15)'
    }
  },
  medical: {
    name: '🏥 Sağlık Lab',
    style: {
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(20,184,166,0.15) 0%, transparent 80%), linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(20,184,166,0.04) 1px, transparent 1px), linear-gradient(135deg, #0d5c56 0%, #042f2c 100%)',
      backgroundSize: '100% 100%, 24px 24px, 24px 24px, 100% 100%',
      border: '1px solid rgba(13,148,136,0.2)'
    }
  },
  space: {
    name: '🚀 Uzay İstasyonu',
    style: {
      backgroundImage: 'radial-gradient(circle at 15% 25%, #fff 1.2px, transparent 2px), radial-gradient(circle at 75% 45%, #fff 1px, transparent 2px), radial-gradient(circle at 40% 70%, #fff 1.5px, transparent 3px), radial-gradient(circle at 85% 80%, #fff 0.8px, transparent 2px), radial-gradient(circle at 50% 20%, rgba(236,72,153,0.12) 0%, transparent 60%), linear-gradient(135deg, #1e1b4b 0%, #03001e 100%)',
      border: '1px solid rgba(139,92,246,0.2)'
    }
  }
};

const PetSection = ({ activeTab, petXp, petLevel, petConfig, setPetConfig }) => {
  const [localName, setLocalName] = useState(petConfig.name || 'Bilge');
  const [selectedAnimal, setSelectedAnimal] = useState(petConfig.animalId || 'chick');
  const [selectedHat, setSelectedHat] = useState(petConfig.hat || 'none');
  const [selectedGlasses, setSelectedGlasses] = useState(petConfig.glasses || 'none');
  const [selectedClothing, setSelectedClothing] = useState(petConfig.clothing || 'none');
  const [selectedItem, setSelectedItem] = useState(petConfig.item || 'none');
  const [selectedBg, setSelectedBg] = useState(petConfig.background || 'cozy');

  useEffect(() => {
    if (petConfig) {
      setLocalName(petConfig.name || 'Bilge');
      setSelectedAnimal(petConfig.animalId || 'chick');
      setSelectedHat(petConfig.hat || 'none');
      setSelectedGlasses(petConfig.glasses || 'none');
      setSelectedClothing(petConfig.clothing || 'none');
      setSelectedItem(petConfig.item || 'none');
      setSelectedBg(petConfig.background || 'cozy');
    }
  }, [petConfig]);

  if (activeTab !== 'pet') return null;

  const handleSavePet = () => {
    const updated = {
      ...petConfig,
      name: localName.trim() || 'Bilge',
      animalId: selectedAnimal,
      hat: selectedHat,
      glasses: selectedGlasses,
      clothing: selectedClothing,
      item: selectedItem,
      background: selectedBg
    };

    setPetConfig(updated);
    localStorage.setItem('yokdil_custom_pet', JSON.stringify(updated));
    window.dispatchEvent(new Event('custom-pet-updated'));
    alert("Evcil hayvanınız başarıyla güncellendi! 🦉🐾");
  };

  // Grow pet size dynamically based on level
  const getGrowthStage = (level) => {
    if (level <= 2) return { name: 'Bebek 🐣', size: 90, color: '#fcd34d' };
    if (level <= 4) return { name: 'Genç Fidan 🐥', size: 125, color: '#fb923c' };
    if (level <= 7) return { name: 'Yetişkin 🦉', size: 155, color: '#38bdf8' };
    return { name: 'Efsanevi Bilge 👑', size: 185, color: '#c084fc' };
  };

  const stage = getGrowthStage(petLevel);
  const dynamicSize = stage.size;

  return (
    <div className="space-y-6 text-left" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-title mb-6">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-paw" style={{ color: '#fb923c' }}></i> Evcil Hayvanım
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Evcil hayvanınızı kişiselleştirin, ismini değiştirin ve kazandığınız XP'lerle büyümesini takip edin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* LEFT COLUMN: VISUAL PREVIEW & STATUS */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', minHeight: '380px' }}>
          
          {/* Room Display */}
          <div style={{
            width: '100%',
            height: '240px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            ...ROOM_BACKGROUNDS[selectedBg]?.style
          }}>
            {/* Window Overlay for Cozy Room */}
            {selectedBg === 'cozy' && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '40px',
                width: '60px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '2px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                <div style={{ flex: 1, borderBottom: '1.5px solid rgba(255, 255, 255, 0.08)' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1.5px', background: 'rgba(255, 255, 255, 0.08)' }} />
              </div>
            )}

            {/* Book Shelf Overlay for Library */}
            {selectedBg === 'library' && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                height: '40px',
                borderTop: '3px solid rgba(217,119,6,0.25)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '5px',
                paddingLeft: '20px',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                <div style={{ width: '12px', height: '28px', background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '10px', height: '32px', background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '2px 2px 0 0', transform: 'rotate(4deg)', transformOrigin: 'bottom center' }} />
                <div style={{ width: '13px', height: '25px', background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '11px', height: '29px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '2px 2px 0 0' }} />
              </div>
            )}

            {/* Chemistry beaker overlay for Science Lab */}
            {selectedBg === 'science' && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '25px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid rgba(16,185,129,0.25)',
                background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'rgba(16,185,129,0.4)',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                ⚛️
              </div>
            )}

            {/* Forest Trees and Mountain Overlays */}
            {selectedBg === 'forest' && (
              <>
                {/* Sun rays */}
                <div style={{ position: 'absolute', top: 0, left: '20%', width: '40px', height: '100%', background: 'linear-gradient(to bottom, rgba(253,224,71,0.06), transparent)', transform: 'skewX(-20deg)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: 0, left: '45%', width: '50px', height: '100%', background: 'linear-gradient(to bottom, rgba(253,224,71,0.04), transparent)', transform: 'skewX(-20deg)', pointerEvents: 'none', zIndex: 0 }} />
                
                {/* Distant Mountains */}
                <div style={{ position: 'absolute', bottom: '20px', left: '-20px', width: '120px', height: '60px', background: 'rgba(6,78,59,0.4)', borderRadius: '100% 100% 0 0', transform: 'scaleY(0.7)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '15px', right: '-10px', width: '140px', height: '70px', background: 'rgba(4,120,87,0.3)', borderRadius: '100% 100% 0 0', transform: 'scaleY(0.6)', pointerEvents: 'none', zIndex: 0 }} />

                {/* Trees Layer */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '15px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  pointerEvents: 'none',
                  zIndex: 0
                }}>
                  {/* Tree 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '0', height: '0', borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '24px solid rgba(16,185,129,0.35)' }} />
                    <div style={{ width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '18px solid rgba(52,211,153,0.35)', marginTop: '-12px' }} />
                    <div style={{ width: '4px', height: '10px', background: 'rgba(120,53,4,0.5)' }} />
                  </div>
                  {/* Tree 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(1.2)' }}>
                    <div style={{ width: '0', height: '0', borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '20px solid rgba(4,120,87,0.4)' }} />
                    <div style={{ width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '16px solid rgba(16,185,129,0.4)', marginTop: '-10px' }} />
                    <div style={{ width: '4px', height: '8px', background: 'rgba(120,53,4,0.5)' }} />
                  </div>
                </div>

                {/* Trees Right Side */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '20px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '10px',
                  pointerEvents: 'none',
                  zIndex: 0
                }}>
                  {/* Tree 3 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(1.1)' }}>
                    <div style={{ width: '0', height: '0', borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: '22px solid rgba(16,185,129,0.35)' }} />
                    <div style={{ width: '0', height: '0', borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '16px solid rgba(52,211,153,0.35)', marginTop: '-11px' }} />
                    <div style={{ width: '4px', height: '10px', background: 'rgba(120,53,4,0.5)' }} />
                  </div>
                </div>

                {/* Grass Floor */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '14px',
                  background: 'linear-gradient(to top, rgba(6,78,59,0.7), rgba(16,185,129,0.4))',
                  borderRadius: '0 0 16px 16px',
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
              </>
            )}

            {/* Ancient Greek Columns overlay for History */}
            {selectedBg === 'history' && (
              <>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20px',
                  width: '20px',
                  height: '160px',
                  background: 'linear-gradient(to right, rgba(251,146,60,0.06), rgba(251,146,60,0.02))',
                  borderLeft: '1.5px solid rgba(251,146,60,0.12)',
                  borderRight: '1.5px solid rgba(251,146,60,0.12)',
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: '20px',
                  width: '20px',
                  height: '160px',
                  background: 'linear-gradient(to left, rgba(251,146,60,0.06), rgba(251,146,60,0.02))',
                  borderLeft: '1.5px solid rgba(251,146,60,0.12)',
                  borderRight: '1.5px solid rgba(251,146,60,0.12)',
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
              </>
            )}

            {/* Floating Moon/Planet for Space Station */}
            {selectedBg === 'space' && (
              <div style={{
                position: 'absolute',
                top: '25px',
                left: '35px',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #fb923c 0%, #c2410c 70%, #7c2d12 100%)',
                boxShadow: '0 0 12px rgba(251,146,60,0.25)',
                opacity: 0.85,
                pointerEvents: 'none',
                zIndex: 0
              }} />
            )}

            <MascotPet
              state="joy"
              speech={null}
              customConfig={{
                animalId: selectedAnimal,
                hat: selectedHat,
                glasses: selectedGlasses,
                clothing: selectedClothing,
                item: selectedItem
              }}
              size={dynamicSize}
              isFloating={false}
            />

            {/* Glowing Aura if high level */}
            {petLevel >= 5 && (
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
            )}
          </div>

          {/* Level & XP Stats */}
          <div style={{ width: '100%', textAlign: 'center', spaceY: 3 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {localName} 
              <span style={{ fontSize: '0.8rem', color: '#fb923c', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold' }}>⭐ Seviye {petLevel}</span>
              <span style={{ fontSize: '0.8rem', color: stage.color, background: `${stage.color}15`, border: `1px solid ${stage.color}40`, padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold' }}>{stage.name}</span>
            </h3>
            
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '4px 0 10px 0' }}>
              XP kazanmak için test çözün, kelime çalışın ve pratik yapın!
            </p>

            {/* XP progress bar */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', height: '10px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <div style={{
                background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                height: '100%',
                width: `${Math.min(100, Math.max(0, (petXp / (petLevel * 200)) * 100))}%`,
                transition: 'width 0.3s ease-out'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#818cf8', fontWeight: 'bold', marginTop: '4px' }}>
              <span>{petXp} XP</span>
              <span>{petLevel * 200} XP (Sonraki Seviye)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION CONTROLS */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            👑 Evcil Hayvanını Giydir
          </h3>

          {/* Pet Name input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Evcil Hayvan Adı</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value.slice(0, 15))}
              placeholder="Evcil hayvanınızın adını yazın..."
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.8rem',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          {/* Select animal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Tür Seçin</label>
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="duo-input"
              style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              {ANIMAL_CATALOG.map(anim => (
                <option key={anim.id} value={anim.id}>{anim.name}</option>
              ))}
            </select>
          </div>

          {/* Select accessories */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Şapka</label>
              <select
                value={selectedHat}
                onChange={(e) => setSelectedHat(e.target.value)}
                style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
              >
                {ACCESSORY_HATS.map(hat => (
                  <option key={hat.id} value={hat.id}>{hat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Gözlük</label>
              <select
                value={selectedGlasses}
                onChange={(e) => setSelectedGlasses(e.target.value)}
                style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
              >
                {ACCESSORY_GLASSES.map(gls => (
                  <option key={gls.id} value={gls.id}>{gls.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Kıyafet</label>
              <select
                value={selectedClothing}
                onChange={(e) => setSelectedClothing(e.target.value)}
                style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
              >
                {ACCESSORY_CLOTHES.map(clt => (
                  <option key={clt.id} value={clt.id}>{clt.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>El Eşyası</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
              >
                {ACCESSORY_ITEMS.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Select background */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Oda Arka Planı</label>
            <select
              value={selectedBg}
              onChange={(e) => setSelectedBg(e.target.value)}
              style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              {Object.keys(ROOM_BACKGROUNDS).map(bgKey => (
                <option key={bgKey} value={bgKey}>{ROOM_BACKGROUNDS[bgKey].name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSavePet}
            className="btn-primary"
            style={{
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              cursor: 'pointer',
              marginTop: '10px',
              width: '100%'
            }}
          >
            💾 Değişiklikleri Kaydet
          </button>

        </div>
      </div>
    </div>
  );
};

export default PetSection;
