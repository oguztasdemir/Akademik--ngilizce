import React, { useState, useEffect } from 'react';
import CardMatchGame from './components/CardMatchGame';
import WordShooterGame from './components/WordShooterGame';
import HangmanGame from './components/HangmanGame';
import SpellingGame from './components/SpellingGame';
import SynonymGame from './components/SynonymGame';
import AntonymGame from './components/AntonymGame';
import TrueFalseGame from './components/TrueFalseGame';
import ClozeGame from './components/ClozeGame';
import DefinitionGame from './components/DefinitionGame';

// Vocabulary database fallback for instant client-side games
const MINI_GAME_VOCAB = {
  fen: [
    { english: 'orbit', turkish: 'yörünge', synonym: 'path', antonym: 'center', definition: 'The curved path of a celestial object or spacecraft round a star, planet, or moon.', sentence: 'The Earth is in a constant ____ around the Sun.', type: 'Noun' },
    { english: 'discovery', turkish: 'keşif', synonym: 'finding', antonym: 'loss', definition: 'The act of finding or learning something for the first time.', sentence: 'The ____ of penicillin changed modern medicine.', type: 'Noun' },
    { english: 'gravity', turkish: 'yerçekimi', synonym: 'attraction', antonym: 'repulsion', definition: 'The force that attracts a body towards the centre of the earth.', sentence: 'Objects fall to the ground due to the force of ____.', type: 'Noun' },
    { english: 'compound', turkish: 'bileşik', synonym: 'mixture', antonym: 'element', definition: 'A thing that is composed of two or more separate elements.', sentence: 'Water is a chemical ____ consisting of hydrogen and oxygen.', type: 'Noun' },
    { english: 'radiation', turkish: 'radyasyon', synonym: 'emission', antonym: 'absorption', definition: 'The emission of energy as electromagnetic waves or subatomic particles.', sentence: 'The ozone layer protects us from harmful solar ____.', type: 'Noun' },
    { english: 'absorb', turkish: 'absorbe etmek', synonym: 'soak up', antonym: 'release', definition: 'Take in or soak up energy, liquid, or other substances.', sentence: 'Plants ____ carbon dioxide from the atmosphere.', type: 'Verb' },
    { english: 'conduct', turkish: 'iletmek', synonym: 'transmit', antonym: 'insulate', definition: 'Transmit a form of energy such as heat or electricity.', sentence: 'Metals like copper ____ electricity very efficiently.', type: 'Verb' },
    { english: 'constant', turkish: 'sabit', synonym: 'stable', antonym: 'variable', definition: 'Occurring continuously or remaining the same over a period of time.', sentence: 'The speed of light is a ____ value in physics.', type: 'Adjective' },
    { english: 'abundant', turkish: 'bol', synonym: 'plentiful', antonym: 'scarce', definition: 'Existing or available in large quantities; overflowing.', sentence: 'Hydrogen is the most ____ element in the universe.', type: 'Adjective' },
    { english: 'precisely', turkish: 'kesinlikle', synonym: 'exactly', antonym: 'vaguely', definition: 'In a exact and accurate manner.', sentence: 'The scientific instruments measured the distance ____.', type: 'Adverb' }
  ],
  saglik: [
    { english: 'treatment', turkish: 'tedavi', synonym: 'therapy', antonym: 'harm', definition: 'Medical care given to a patient for an illness or injury.', sentence: 'Chemotherapy is a common ____ for cancer patients.', type: 'Noun' },
    { english: 'disease', turkish: 'hastalık', synonym: 'illness', antonym: 'health', definition: 'A disorder of structure or function in a human, animal, or plant.', sentence: 'Lyme ____ is transmitted to humans through tick bites.', type: 'Noun' },
    { english: 'symptom', turkish: 'belirti', synonym: 'indication', antonym: 'cause', definition: 'A physical or mental sign which indicates a condition of disease.', sentence: 'A dry cough is a common ____ of respiratory infections.', type: 'Noun' },
    { english: 'vaccine', turkish: 'aşı', synonym: 'immunization', antonym: 'pathogen', definition: 'A substance used to stimulate the production of antibodies.', sentence: 'The polio ____ has nearly eradicated the disease worldwide.', type: 'Noun' },
    { english: 'infection', turkish: 'enfeksiyon', synonym: 'contamination', antonym: 'purity', definition: 'The invasion and growth of germs in the body.', sentence: 'Wash the wound to prevent a bacterial ____.', type: 'Noun' },
    { english: 'diagnose', turkish: 'teşhis etmek', synonym: 'identify', antonym: 'misinterpret', definition: 'Identify the nature of an illness by examination of symptoms.', sentence: 'Doctors use blood tests to ____ diabetes.', type: 'Verb' },
    { english: 'prescribe', turkish: 'reçete etmek', synonym: 'order', antonym: 'ban', definition: 'Advise and authorize the use of a medicine or treatment.', sentence: 'The doctor will ____ antibiotics for your throat infection.', type: 'Verb' },
    { english: 'immune', turkish: 'bağışıklık', synonym: 'resistant', antonym: 'susceptible', definition: 'Protected or exempt from a disease or pathogen.', sentence: 'Vaccinated individuals become ____ to the specific virus.', type: 'Adjective' },
    { english: 'severe', turkish: 'şiddetli', synonym: 'acute', antonym: 'mild', definition: 'Very great, intense, or harsh in medical illness symptoms.', sentence: 'The patient experienced ____ chest pain during the attack.', type: 'Adjective' },
    { english: 'gradually', turkish: 'yavaş yavaş', synonym: 'slowly', antonym: 'suddenly', definition: 'By degrees or in a gradual, slow-moving manner.', sentence: 'The patient recovered ____ after the complex surgery.', type: 'Adverb' }
  ],
  sosyal: [
    { english: 'society', turkish: 'toplum', synonym: 'community', antonym: 'individual', definition: 'People living together in a more or less ordered community.', sentence: 'Education plays a critical role in shaping modern ____.', type: 'Noun' },
    { english: 'culture', turkish: 'kültür', synonym: 'tradition', antonym: 'nature', definition: 'The customs, arts, and social institutions of a nation.', sentence: 'We spent the summer studying the local ____ of the Andes.', type: 'Noun' },
    { english: 'heritage', turkish: 'miras', synonym: 'legacy', antonym: 'loss', definition: 'Property or cultural traditions that can be inherited.', sentence: 'Historic buildings are an essential part of our national ____.', type: 'Noun' },
    { english: 'inflation', turkish: 'enflasyon', synonym: 'price rise', antonym: 'deflation', definition: 'A general increase in prices and fall in the purchasing value of money.', sentence: 'Central banks raise interest rates to control rising ____.', type: 'Noun' },
    { english: 'government', turkish: 'hükümet', synonym: 'administration', antonym: 'anarchy', definition: 'The group of people with the authority to govern a country.', sentence: 'The ____ announced a new policy to support low-income families.', type: 'Noun' },
    { english: 'govern', turkish: 'yönetmek', synonym: 'rule', antonym: 'obey', definition: 'Conduct the policy, actions, and affairs of a state.', sentence: 'It is difficult to ____ a nation with diverse populations.', type: 'Verb' },
    { english: 'abolish', turkish: 'yürürlükten kaldırmak', synonym: 'cancel', antonym: 'enact', definition: 'Formally put an end to a system, practice, or institution.', sentence: 'Many nations decided to ____ slavery in the 19th century.', type: 'Verb' },
    { english: 'democratic', turkish: 'demokratik', synonym: 'representative', antonym: 'authoritarian', definition: 'Supporting social equality and electing leaders by voting.', sentence: 'The constitution guarantees a ____ election process.', type: 'Adjective' },
    { english: 'stable', turkish: 'istikrarlı', synonym: 'steady', antonym: 'volatile', definition: 'Not likely to change, fail, or fluctuate.', sentence: 'A ____ economy attracts foreign investment.', type: 'Adjective' },
    { english: 'mutually', turkish: 'karşılıklı olarak', synonym: 'reciprocally', antonym: 'unilaterally', definition: 'With mutual action or relation between two parties.', sentence: 'Both countries signed a ____ beneficial trade agreement.', type: 'Adverb' }
  ]
};

const GAMES_CATALOG = [
  { id: 'match', name: '1. Kart Eşleştirme (Memory)', desc: 'İngilizce kelimeleri Türkçe anlamlarıyla kart çevirerek eşleştirin.', color: '#ec4899', icon: 'fa-clone' },
  { id: 'shooter', name: '2. Kelime Avcısı (Shooter)', desc: 'Yukarıdan düşen kelime yere çarpmadan doğru çevirisini vurun!', color: '#3b82f6', icon: 'fa-bullseye' },
  { id: 'hangman', name: '3. Kelime Asmaca (Hangman)', desc: 'Harfleri tahmin ederek gizli YÖKDİL kelimesini kurtarın.', color: '#10b981', icon: 'fa-skull-crossbones' },
  { id: 'spelling', name: '4. Harf Karıştırma (Spelling)', desc: 'Karışık verilen harfleri doğru sıraya dizerek kelimeyi yazın.', color: '#fb923c', icon: 'fa-arrow-down-a-z' },
  { id: 'synonym', name: '5. Eş Anlam Eşleştirme', desc: 'Akademik kelimeleri benzer anlamlı İngilizce kelimeleriyle eşleştirin.', color: '#a855f7', icon: 'fa-equals' },
  { id: 'antonym', name: '6. Zıt Anlam Eşleştirme', desc: 'Kelimeleri zıt anlamlı İngilizce kelimeleriyle eşleştirin.', color: '#f43f5e', icon: 'fa-right-left' },
  { id: 'tf_run', name: '7. Doğru / Yanlış Çeviri', desc: 'Karşınıza çıkan çevirinin doğru mu yanlış mı olduğunu hızlıca seçin.', color: '#06b6d4', icon: 'fa-circle-check' },
  { id: 'cloze', name: '8. Cümle Tamamlama', desc: 'Akademik cümlelerdeki boşluğa uygun olan kelimeyi yerleştirin.', color: '#f59e0b', icon: 'fa-pen-clip' },
  { id: 'definition', name: '9. Tanım Bulmaca', desc: 'İngilizce tanımı verilen akademik kelimeyi tahmin edin.', color: '#14b8a6', icon: 'fa-book-bookmark' }
];

const GamesSection = ({ selectedCategory, awardPetXp }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [vocabList, setVocabList] = useState([]);

  useEffect(() => {
    const cat = selectedCategory || 'fen';
    setVocabList(MINI_GAME_VOCAB[cat] || MINI_GAME_VOCAB.fen);
  }, [selectedCategory]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px', textAlign: 'left' }}>
      
      <div className="section-title mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-gamepad" style={{ color: '#ec4899' }}></i> 10x Akademik Mini Oyunlar
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            YÖKDİL akademik kelime dağarcığınızı pekiştirecek 10 harika eğitsel oyun!
          </p>
        </div>
        {activeGame && (
          <button 
            onClick={() => setActiveGame(null)}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-arrow-left"></i> Oyun Seçimine Dön
          </button>
        )}
      </div>

      {!activeGame ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {GAMES_CATALOG.map((g) => (
            <div 
              key={g.id} 
              className="glass-card" 
              style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${g.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: g.color, fontSize: '20px' }}>
                  <i className={`fa-solid ${g.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', margin: 0 }}>{g.name}</h3>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, flex: 1 }}>
                {g.desc}
              </p>
              <button 
                onClick={() => setActiveGame(g.id)}
                className="btn-primary" 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 'bold', cursor: 'pointer', background: `linear-gradient(135deg, ${g.color}, ${g.color}dd)`, border: 'none', color: 'white' }}
              >
                Oyunu Başlat 🎮
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {activeGame === 'match' && <CardMatchGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'shooter' && <WordShooterGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'hangman' && <HangmanGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'spelling' && <SpellingGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'synonym' && <SynonymGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'antonym' && <AntonymGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'tf_run' && <TrueFalseGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'cloze' && <ClozeGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'definition' && <DefinitionGame vocab={vocabList} awardPetXp={awardPetXp} />}
        </div>
      )}

    </div>
  );
};

export default GamesSection;
