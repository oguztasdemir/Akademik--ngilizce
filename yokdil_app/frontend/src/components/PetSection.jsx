import React, { useState, useEffect } from 'react';
import MascotPet, { ANIMAL_CATALOG, ACCESSORY_HATS, ACCESSORY_GLASSES, ACCESSORY_CLOTHES, ACCESSORY_ITEMS } from './MascotPet';

const ROOM_BACKGROUNDS = {
  cozy: {
    name: 'Cozy Cam 🏠',
    gradient: 'linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.6))',
    border: 'rgba(255,255,255,0.05)'
  },
  library: {
    name: '📚 Kütüphane',
    gradient: 'linear-gradient(135deg, rgba(69,26,3,0.5) 0%, rgba(30,27,75,0.6) 100%)',
    border: 'rgba(217,119,6,0.15)'
  },
  science: {
    name: '🔬 Fen Lab',
    gradient: 'linear-gradient(135deg, rgba(2,44,34,0.5) 0%, rgba(15,23,42,0.6) 100%)',
    border: 'rgba(16,185,129,0.15)'
  },
  history: {
    name: '🏛️ Antik Harabeler',
    gradient: 'linear-gradient(135deg, rgba(124,45,18,0.5) 0%, rgba(76,29,149,0.6) 100%)',
    border: 'rgba(249,115,22,0.15)'
  },
  medical: {
    name: '🏥 Sağlık Lab',
    gradient: 'linear-gradient(135deg, rgba(15,118,110,0.5) 0%, rgba(15,23,42,0.6) 100%)',
    border: 'rgba(13,148,136,0.15)'
  },
  space: {
    name: '🚀 Uzay İstasyonu',
    gradient: 'linear-gradient(135deg, rgba(49,16,132,0.5) 0%, rgba(3,0,30,0.6) 100%)',
    border: 'rgba(139,92,246,0.15)'
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
            border: `1px solid ${ROOM_BACKGROUNDS[selectedBg]?.border || 'rgba(255, 255, 255, 0.05)'}`,
            background: ROOM_BACKGROUNDS[selectedBg]?.gradient || 'rgba(255,255,255,0.01)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
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
                zIndex: 0
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
                width: `${petXp}%`,
                transition: 'width 0.3s ease-out'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#818cf8', fontWeight: 'bold', marginTop: '4px' }}>
              <span>{petXp} XP</span>
              <span>100 XP (Sonraki Seviye)</span>
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
