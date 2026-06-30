import React, { useState, useEffect } from 'react';
import MascotOwl from './MascotOwl';
import MascotPet, { 
  ANIMAL_CATALOG, 
  ACCESSORY_HATS, 
  ACCESSORY_GLASSES, 
  ACCESSORY_CLOTHES, 
  ACCESSORY_ITEMS 
} from './MascotPet';

const ROOM_BACKGROUNDS = {
  cozy: {
    name: 'Cozy Cam 🏠',
    gradient: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))',
    border: 'rgba(255,255,255,0.06)'
  },
  library: {
    name: '📚 Kütüphane',
    gradient: 'linear-gradient(135deg, #451a03 0%, #1e1b4b 100%)',
    border: 'rgba(217,119,6,0.15)'
  },
  science: {
    name: '🔬 Fen Lab',
    gradient: 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
    border: 'rgba(16,185,129,0.15)'
  },
  history: {
    name: '🏛️ Antik Harabeler',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #4c1d95 100%)',
    border: 'rgba(249,115,22,0.15)'
  },
  medical: {
    name: '🏥 Sağlık Lab',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #0f172a 100%)',
    border: 'rgba(13,148,136,0.15)'
  },
  space: {
    name: '🚀 Uzay İstasyonu',
    gradient: 'linear-gradient(135deg, #311084 0%, #03001e 100%)',
    border: 'rgba(139,92,246,0.15)'
  }
};

const VirtualShop = ({ activeTab }) => {
  const [shopTab, setShopTab] = useState('animals');
  const [searchTerm, setSearchTerm] = useState('');
  const [petConfig, setPetConfig] = useState({
    animalId: 'chick',
    hat: 'none',
    glasses: 'none',
    clothing: 'none',
    item: 'none',
    name: 'Bilge',
    background: 'cozy',
    color: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('yokdil_custom_pet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPetConfig({
          name: 'Bilge',
          background: 'cozy',
          color: '',
          ...parsed
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateConfig = (key, value) => {
    const newConfig = { ...petConfig, [key]: value };
    setPetConfig(newConfig);
    localStorage.setItem('yokdil_custom_pet', JSON.stringify(newConfig));
    // Dispatch events to update MascotOwl on other screens instantly
    window.dispatchEvent(new Event('custom-pet-updated'));
  };

  if (activeTab !== 'shop') return null;

  // Filter animals based on search
  const filteredAnimals = ANIMAL_CATALOG.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabStyle = (active) => ({
    padding: '8px 16px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    background: active ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)',
    border: active ? 'none' : '1px solid rgba(255,255,255,0.05)',
    color: active ? '#fff' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: '1',
    textAlign: 'center'
  });

  return (
    <div className="space-y-6 text-left">
      <div className="section-title">
        <h2>Evcil Hayvan & Gardırop 🦄</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Kendi akademik çalışma arkadaşınızı tasarlayın! 100 farklı hayvan ve onlarca kıyafet seçeneği tamamen ücretsiz ve kilitsizdir.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Left Side: Dynamic Live Preview */}
        <div 
          className="glass-card" 
          style={{ 
            flex: '1', 
            minWidth: '280px', 
            maxWidth: '340px', 
            padding: '24px', 
            borderRadius: '24px', 
            border: `1px solid ${ROOM_BACKGROUNDS[petConfig.background || 'cozy']?.border || 'rgba(255,255,255,0.05)'}`, 
            background: ROOM_BACKGROUNDS[petConfig.background || 'cozy']?.gradient || 'rgba(99,102,241,0.02)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '20px',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontSize: '0.64rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Canlı Önizleme</span>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <MascotPet state="happy" customConfig={petConfig} size={110} isFloating={false} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Arkadaşının İsmi</label>
            <input 
              type="text" 
              value={petConfig.name || 'Bilge'} 
              onChange={(e) => updateConfig('name', e.target.value)} 
              placeholder="Arkadaşına isim ver..." 
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '0.78rem',
                color: 'white',
                outline: 'none',
                textAlign: 'center',
                fontWeight: '800'
              }}
            />
          </div>

          <div style={{ width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', margin: '0 0 4px 0' }}>
              {ANIMAL_CATALOG.find(a => a.id === petConfig.animalId)?.name || 'Bilinmeyen'}
            </h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
              Aktif Çalışma Arkadaşınız
            </p>
          </div>
        </div>

        {/* Right Side: Tabbed Catalog Customizer */}
        <div style={{ flex: '2', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.01)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <button onClick={() => setShopTab('animals')} style={tabStyle(shopTab === 'animals')}>🐾 Hayvanlar ({ANIMAL_CATALOG.length})</button>
            <button onClick={() => setShopTab('hats')} style={tabStyle(shopTab === 'hats')}>🤠 Şapkalar</button>
            <button onClick={() => setShopTab('glasses')} style={tabStyle(shopTab === 'glasses')}>😎 Gözlükler</button>
            <button onClick={() => setShopTab('clothing')} style={tabStyle(shopTab === 'clothing')}>👕 Kıyafetler</button>
            <button onClick={() => setShopTab('items')} style={tabStyle(shopTab === 'items')}>🪄 Eşyalar</button>
            <button onClick={() => setShopTab('colors')} style={tabStyle(shopTab === 'colors')}>🎨 Renk</button>
            <button onClick={() => setShopTab('rooms')} style={tabStyle(shopTab === 'rooms')}>🏠 Odalar</button>
          </div>

          {/* Tab Content: Animals */}
          {shopTab === 'animals' && (
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="100 hayvan arasında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'white',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredAnimals.map(animal => {
                  const isSelected = petConfig.animalId === animal.id;
                  return (
                    <button
                      key={animal.id}
                      onClick={() => updateConfig('animalId', animal.id)}
                      className="glass-card flex flex-col items-center justify-center transition-all hover:scale-[1.03]"
                      style={{
                        padding: '16px 8px',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)',
                        background: isSelected ? 'rgba(251,191,36,0.06)' : 'rgba(15,23,42,0.3)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MascotPet 
                          state="neutral" 
                          customConfig={{
                            animalId: animal.id,
                            hat: 'none',
                            glasses: 'none',
                            clothing: 'none',
                            item: 'none'
                          }} 
                          size={44}
                        />
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: '800', color: isSelected ? '#fbbf24' : '#cbd5e1' }}>
                        {animal.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Content: Hats */}
          {shopTab === 'hats' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {ACCESSORY_HATS.map(hat => {
                const isSelected = petConfig.hat === hat.id;
                return (
                  <button
                    key={hat.id}
                    onClick={() => updateConfig('hat', hat.id)}
                    className="glass-card flex flex-col items-center justify-center p-3 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MascotPet 
                        state="neutral" 
                        customConfig={{
                          ...petConfig,
                          hat: hat.id
                        }} 
                        size={44}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1', textAlign: 'center' }}>
                      {hat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content: Glasses */}
          {shopTab === 'glasses' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {ACCESSORY_GLASSES.map(glass => {
                const isSelected = petConfig.glasses === glass.id;
                return (
                  <button
                    key={glass.id}
                    onClick={() => updateConfig('glasses', glass.id)}
                    className="glass-card flex flex-col items-center justify-center p-3 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MascotPet 
                        state="neutral" 
                        customConfig={{
                          ...petConfig,
                          glasses: glass.id
                        }} 
                        size={44}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1', textAlign: 'center' }}>
                      {glass.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content: Clothing */}
          {shopTab === 'clothing' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {ACCESSORY_CLOTHES.map(cloth => {
                const isSelected = petConfig.clothing === cloth.id;
                return (
                  <button
                    key={cloth.id}
                    onClick={() => updateConfig('clothing', cloth.id)}
                    className="glass-card flex flex-col items-center justify-center p-3 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MascotPet 
                        state="neutral" 
                        customConfig={{
                          ...petConfig,
                          clothing: cloth.id
                        }} 
                        size={44}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1', textAlign: 'center' }}>
                      {cloth.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content: Held Items */}
          {shopTab === 'items' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {ACCESSORY_ITEMS.map(item => {
                const isSelected = petConfig.item === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => updateConfig('item', item.id)}
                    className="glass-card flex flex-col items-center justify-center p-3 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MascotPet 
                        state="neutral" 
                        customConfig={{
                          ...petConfig,
                          item: item.id
                        }} 
                        size={44}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1', textAlign: 'center' }}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content: Colors */}
          {shopTab === 'colors' && (
            <div className="space-y-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Özel Renk Seçin:</span>
                <input 
                  type="color" 
                  value={petConfig.color || '#FBBF24'} 
                  onChange={(e) => updateConfig('color', e.target.value)} 
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'none',
                    width: '50px',
                    height: '32px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', marginTop: '12px' }}>
                {[
                  { name: 'Varsayılan', val: '' },
                  { name: 'Kırmızı', val: '#EF4444' },
                  { name: 'Pembe', val: '#EC4899' },
                  { name: 'Mor', val: '#8B5CF6' },
                  { name: 'Mavi', val: '#3B82F6' },
                  { name: 'Açık Mavi', val: '#0EA5E9' },
                  { name: 'Turkuaz', val: '#14B8A6' },
                  { name: 'Yeşil', val: '#10B981' },
                  { name: 'Fıstık', val: '#84CC16' },
                  { name: 'Sarı', val: '#FBBF24' },
                  { name: 'Turuncu', val: '#F97316' },
                  { name: 'Koyu Gri', val: '#475569' },
                  { name: 'Gümüş', val: '#94A3B8' }
                ].map(col => {
                  const isSelected = (!col.val && !petConfig.color) || (petConfig.color === col.val);
                  return (
                    <button
                      key={col.name}
                      onClick={() => updateConfig('color', col.val)}
                      className="glass-card flex flex-col items-center justify-center p-3 transition-all hover:scale-[1.03]"
                      style={{
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)',
                        background: isSelected ? 'rgba(251,191,36,0.06)' : 'rgba(15,23,42,0.3)',
                        cursor: 'pointer',
                        gap: '6px'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: col.val || ANIMAL_CATALOG.find(a => a.id === petConfig.animalId)?.color || '#FBBF24',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }} />
                      <span style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 'bold' }}>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Content: Rooms */}
          {shopTab === 'rooms' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {Object.entries(ROOM_BACKGROUNDS).map(([key, bg]) => {
                const isSelected = (petConfig.background || 'cozy') === key;
                return (
                  <button
                    key={key}
                    onClick={() => updateConfig('background', key)}
                    className="glass-card flex flex-col items-center justify-center p-3 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      background: bg.gradient,
                      border: `1px solid ${bg.border}`
                    }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1' }}>
                      {bg.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualShop;
