import React, { useState, useEffect } from 'react';
import MascotOwl from './MascotOwl';
import { 
  ANIMAL_CATALOG, 
  ACCESSORY_HATS, 
  ACCESSORY_GLASSES, 
  ACCESSORY_CLOTHES, 
  ACCESSORY_ITEMS 
} from './MascotPet';

const VirtualShop = ({ activeTab }) => {
  const [shopTab, setShopTab] = useState('animals'); // 'animals', 'hats', 'glasses', 'clothing', 'items'
  const [searchTerm, setSearchTerm] = useState('');
  const [petConfig, setPetConfig] = useState({
    animalId: 'chick',
    hat: 'none',
    glasses: 'none',
    clothing: 'none',
    item: 'none'
  });

  useEffect(() => {
    const saved = localStorage.getItem('yokdil_custom_pet');
    if (saved) {
      try {
        setPetConfig(JSON.parse(saved));
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
        <div className="glass-card" style={{ flex: '1', minWidth: '280px', maxWidth: '340px', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(99,102,241,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.64rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Canlı Önizleme</span>
          
          <div style={{ transform: 'scale(1.6)', margin: '40px 0' }}>
            <MascotOwl state="happy" speech="Harika görünüyorum!" />
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
          {/* Customizer Subtabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.01)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <button onClick={() => setShopTab('animals')} style={tabStyle(shopTab === 'animals')}>🐾 Hayvanlar ({ANIMAL_CATALOG.length})</button>
            <button onClick={() => setShopTab('hats')} style={tabStyle(shopTab === 'hats')}>🤠 Şapkalar</button>
            <button onClick={() => setShopTab('glasses')} style={tabStyle(shopTab === 'glasses')}>😎 Gözlükler</button>
            <button onClick={() => setShopTab('clothing')} style={tabStyle(shopTab === 'clothing')}>👕 Kıyafetler</button>
            <button onClick={() => setShopTab('items')} style={tabStyle(shopTab === 'items')}>🪄 Eşyalar</button>
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
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: animal.color, marginBottom: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
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
                    className="glass-card flex flex-col items-center justify-center p-5 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1' }}>
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
                    className="glass-card flex flex-col items-center justify-center p-5 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1' }}>
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
                    className="glass-card flex flex-col items-center justify-center p-5 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1' }}>
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
                    className="glass-card flex flex-col items-center justify-center p-5 transition-all hover:scale-[1.02]"
                    style={{
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: isSelected ? '#a5b4fc' : '#cbd5e1' }}>
                      {item.name}
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
