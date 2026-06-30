import React from 'react';

export const ANIMAL_CATALOG = [
  { id: 'chick', name: 'Civciv 🐥', type: 'round', color: '#FBBF24', cheek: '#FDA4AF' },
  { id: 'duck', name: 'Ördek 🦆', type: 'bill', color: '#FDE047', cheek: '#FCA5A5' },
  { id: 'owl', name: 'Baykuş 🦉', type: 'owl', color: '#A78BFA', cheek: '#C084FC' },
  { id: 'penguin', name: 'Penguen 🐧', type: 'penguin', color: '#334155', cheek: '#94A3B8' },
  { id: 'parrot', name: 'Papağan 🦜', type: 'round', color: '#10B981', cheek: '#34D399' },
  { id: 'canary', name: 'Kanarya 🐦', type: 'round', color: '#FCD34D', cheek: '#FBBF24' },
  { id: 'swan', name: 'Kuğu 🦢', type: 'bill', color: '#F8FAFC', cheek: '#E2E8F0' },
  { id: 'pelican', name: 'Pelikan 🦤', type: 'bill', color: '#FFF1F2', cheek: '#FECDD3' },
  { id: 'flamingo', name: 'Flamingo 🦩', type: 'bill', color: '#F472B6', cheek: '#F472B6' },
  { id: 'seagull', name: 'Martı 🕊️', type: 'bill', color: '#E2E8F0', cheek: '#CBD5E1' },
  { id: 'crow', name: 'Karga 🦅', type: 'bill', color: '#1E293B', cheek: '#475569' },
  { id: 'pigeon', name: 'Güvercin 🐦', type: 'round', color: '#94A3B8', cheek: '#CBD5E1' },
  { id: 'woodpecker', name: 'Ağaçkakan 🪵', type: 'bill', color: '#EF4444', cheek: '#F87171' },
  { id: 'eagle', name: 'Kartal 🦅', type: 'bill', color: '#78350F', cheek: '#B45309' },
  { id: 'hawk', name: 'Şahin 🦅', type: 'bill', color: '#854D0E', cheek: '#CA8A04' },
  { id: 'hummingbird', name: 'Sinekkuşu 🌸', type: 'bill', color: '#06B6D4', cheek: '#22D3EE' },
  { id: 'toucan', name: 'Tukan 🦜', type: 'bill', color: '#F97316', cheek: '#F97316' },
  { id: 'bat', name: 'Yarasa 🦇', type: 'pointy', color: '#475569', cheek: '#64748B' },
  
  { id: 'mosquito', name: 'Sivrisinek 🦟', type: 'mosquito', color: '#475569', cheek: '#94A3B8' },
  { id: 'bee', name: 'Arı 🐝', type: 'insect', color: '#FBBF24', cheek: '#FCD34D', stripes: true },
  { id: 'butterfly', name: 'Kelebek 🦋', type: 'butterfly', color: '#C084FC', cheek: '#E9D5FF' },
  { id: 'ladybug', name: 'Uğurböceği 🐞', type: 'ladybug', color: '#EF4444', cheek: '#F87171' },
  { id: 'ant', name: 'Karınca 🐜', type: 'insect', color: '#7A1D1D', cheek: '#B91C1C' },
  
  { id: 'whale', name: 'Balina 🐳', type: 'whale', color: '#0284C7', cheek: '#38BDF8' },
  { id: 'dolphin', name: 'Yunus 🐬', type: 'whale', color: '#0EA5E9', cheek: '#7DD3FC' },
  { id: 'shark', name: 'Köpekbalığı 🦈', type: 'fish', color: '#475569', cheek: '#94A3B8' },
  { id: 'fish', name: 'Balık 🐟', type: 'fish', color: '#38BDF8', cheek: '#7DD3FC' },
  { id: 'goldfish', name: 'Japon Balığı 🐠', type: 'fish', color: '#F97316', cheek: '#FDBA74' },
  
  { id: 'snake', name: 'Yılan 🐍', type: 'snake', color: '#15803D', cheek: '#86EFAC' },
  { id: 'crocodile', name: 'Timsah 🐊', type: 'reptile', color: '#065F46', cheek: '#34D399' },
  { id: 'chameleon', name: 'Bukalemun 🦎', type: 'reptile', color: '#84CC16', cheek: '#A3E635' },
  { id: 'turtle', name: 'Kaplumbağa 🐢', type: 'turtle', color: '#047857', cheek: '#A7F3D0' },
  { id: 'seaturtle', name: 'Deniz Kaplumbağası 🐢', type: 'turtle', color: '#0D9488', cheek: '#99F6E4' },
  { id: 'snail', name: 'Salyangoz 🐌', type: 'snail', color: '#FDBA74', cheek: '#FCA5A5' },
  
  { id: 'cat', name: 'Kedi 🐱', type: 'pointy', color: '#F97316', cheek: '#FDBA74' },
  { id: 'kitten', name: 'Yavru Kedi 🐈', type: 'pointy', color: '#E2E8F0', cheek: '#FCA5A5' },
  { id: 'tiger', name: 'Kaplan 🐯', type: 'pointy', color: '#EA580C', cheek: '#FDBA74', stripes: true },
  { id: 'lion', name: 'Aslan 🦁', type: 'lion', color: '#D97706', cheek: '#F59E0B' },
  { id: 'leopard', name: 'Pars 🐆', type: 'pointy', color: '#F59E0B', cheek: '#FDE047', spots: true },
  { id: 'cheetah', name: 'Çita 🐆', type: 'pointy', color: '#FCD34D', cheek: '#FDE047', spots: true },
  
  { id: 'dog', name: 'Köpek 🐶', type: 'floppy', color: '#854D0E', cheek: '#A16207' },
  { id: 'puppy', name: 'Yavru Köpek 🐕', type: 'floppy', color: '#D97706', cheek: '#F59E0B' },
  { id: 'wolf', name: 'Kurt 🐺', type: 'pointy', color: '#64748B', cheek: '#94A3B8' },
  { id: 'fox', name: 'Tilki 🦊', type: 'pointy', color: '#EA580C', cheek: '#F97316' },
  
  { id: 'panda', name: 'Dev Panda 🐼', type: 'panda', color: '#F8FAFC', cheek: '#FDA4AF' },
  { id: 'redpanda', name: 'Kızıl Panda 🦊', type: 'pointy', color: '#EA580C', cheek: '#FCA5A5' },
  { id: 'koala', name: 'Koala 🐨', type: 'koala', color: '#94A3B8', cheek: '#E2E8F0' },
  { id: 'bear', name: 'Ayı 🐻', type: 'bear', color: '#78350F', cheek: '#92400E' },
  { id: 'polarbear', name: 'Kutup Ayısı 🐻‍❄️', type: 'bear', color: '#F8FAFC', cheek: '#E2E8F0' },
  
  { id: 'rabbit', name: 'Tavşan 🐰', type: 'long-ears', color: '#E2E8F0', cheek: '#FCA5A5' },
  { id: 'monkey', name: 'Maymun 🐵', type: 'monkey', color: '#854D0E', cheek: '#FECDD3' },
  
  { id: 'pig', name: 'Domuz 🐷', type: 'pig', color: '#F472B6', cheek: '#F472B6' },
  { id: 'cow', name: 'İnek 🐮', type: 'horned', color: '#FFFDF0', cheek: '#FDA4AF', spots: true },
  { id: 'sheep', name: 'Koyun 🐑', type: 'sheep', color: '#F8FAFC', cheek: '#FDA4AF' },
  { id: 'lamb', name: 'Kuzu 🐏', type: 'sheep', color: '#FFFDF0', cheek: '#FCA5A5' },
  { id: 'goat', name: 'Keçi 🐐', type: 'horned', color: '#E2E8F0', cheek: '#CBD5E1' },
  { id: 'donkey', name: 'Eşek 🫏', type: 'long-ears', color: '#64748B', cheek: '#94A3B8' },
  { id: 'horse', name: 'At 🐴', type: 'bear', color: '#B45309', cheek: '#D97706' },
  { id: 'zebra', name: 'Zebra 🦓', type: 'bear', color: '#F8FAFC', cheek: '#E2E8F0', stripes: true },
  
  { id: 'deer', name: 'Geyik 🦌', type: 'horned', color: '#A16207', cheek: '#CA8A04' },
  { id: 'llama', name: 'Lama 🦙', type: 'bear', color: '#FFFDF0', cheek: '#FCA5A5' },
  { id: 'elephant', name: 'Fil 🐘', type: 'trunk', color: '#94A3B8', cheek: '#E2E8F0' },
  
  { id: 'frog', name: 'Kurbağa 🐸', type: 'frog', color: '#10B981', cheek: '#6EE7B7' },
  { id: 'octopus', name: 'Ahtapot 🐙', type: 'octopus', color: '#EC4899', cheek: '#F472B6' },
  { id: 'squid', name: 'Mürekkep Balığı 🦑', type: 'octopus', color: '#A855F7', cheek: '#C084FC' },
  { id: 'jellyfish', name: 'Denizanası 🪼', type: 'jellyfish', color: '#F472B6', cheek: '#F472B6' },
  { id: 'crab', name: 'Yengeç 🦀', type: 'crab', color: '#EF4444', cheek: '#F87171' },
  { id: 'lobster', name: 'Istakoz 🦞', type: 'crab', color: '#DC2626', cheek: '#F87171' },
  { id: 'seahorse', name: 'Denizatı 🦄', type: 'seahorse', color: '#EAB308', cheek: '#FDE047' },
  { id: 'starfish', name: 'Denizyıldızı ⭐', type: 'starfish', color: '#F43F5E', cheek: '#FDA4AF' }
];

export const ACCESSORY_HATS = [
  { id: 'none', name: 'Şapka Yok' },
  { id: 'cowboy', name: 'Kovboy Şapkası 🤠' },
  { id: 'crown', name: 'Kral Tacı 👑' },
  { id: 'wizard', name: 'Büyücü Şapkası 🧙' },
  { id: 'baseball', name: 'Beyzbol Şapkası 🧢' },
  { id: 'detective', name: 'Dedektif Şapkası 🕵️' },
  { id: 'beanie', name: 'Kışlık Bere ❄️' },
  { id: 'chef', name: 'Şef Şapkası 🧑‍🍳' },
  { id: 'pirate', name: 'Korsan Şapkası 🏴‍☠️' },
  { id: 'viking', name: 'Viking Miğferi 🪖' },
  { id: 'santa', name: 'Noel Baba Şapkası 🎅' },
  { id: 'grad', name: 'Mezuniyet Kepi 🎓' },
  { id: 'sombrero', name: 'Sombrero 👒' },
  { id: 'tophat', name: 'Silindir Şapka 🎩' }
];

export const ACCESSORY_GLASSES = [
  { id: 'none', name: 'Gözlük Yok' },
  { id: 'cool', name: 'Havalı Gözlük 😎' },
  { id: 'nerd', name: 'Yuvarlak Gözlük 🤓' },
  { id: 'monocle', name: 'Monokl 🧐' },
  { id: 'star', name: 'Yıldız Gözlük ⭐' },
  { id: 'heart', name: 'Kalp Gözlük ❤️' },
  { id: 'laser', name: 'Lazer Vizör 🥽' },
  { id: 'glasses3d', name: '3D Gözlük 🕶️' },
  { id: 'eyepatch', name: 'Göz Bandı 🏴‍☠️' }
];

export const ACCESSORY_CLOTHES = [
  { id: 'none', name: 'Kıyafet Yok' },
  { id: 'shirt', name: 'Kırmızı Tişört 👕' },
  { id: 'hoodie', name: 'Mavi Kapüşonlu 🧥' },
  { id: 'suit', name: 'Takım Elbise 👔' },
  { id: 'bowtie', name: 'Kırmızı Papyon 🎀' },
  { id: 'cape', name: 'Kahraman Pelerini 🦸' },
  { id: 'scarf', name: 'Kışlık Atkı 🧣' },
  { id: 'tux', name: 'Smokin 🤵' },
  { id: 'doctor', name: 'Doktor Önlüğü 🥼' },
  { id: 'space', name: 'Astronot Giysisi 👨‍🚀' },
  { id: 'detectivecoat', name: 'Trençkot 🧥' },
  { id: 'kimono', name: 'Kimono 👘' },
  { id: 'pyjamas', name: 'Pijama 🛌' }
];

export const ACCESSORY_ITEMS = [
  { id: 'none', name: 'Eşya Yok' },
  { id: 'wand', name: 'Sihirli Değnek 🪄' },
  { id: 'sword', name: 'Kılıç ⚔️' },
  { id: 'book', name: 'Kitap 📖' },
  { id: 'mug', name: 'Kahve Kupası ☕' },
  { id: 'shield', name: 'Kalkan 🛡️' },
  { id: 'trophy', name: 'Altın Kupa 🏆' },
  { id: 'palette', name: 'Boya Paleti 🎨' },
  { id: 'mic', name: 'Mikrofon 🎤' },
  { id: 'laptop', name: 'Dizüstü Bilgisayar 💻' }
];

const MascotPet = ({ state, speech, customConfig, size = 80, isFloating = false }) => {
  const config = customConfig || {
    animalId: 'chick',
    hat: 'none',
    glasses: 'none',
    clothing: 'none',
    item: 'none'
  };

  const animal = ANIMAL_CATALOG.find(a => a.id === config.animalId) || ANIMAL_CATALOG[0];

  let bodyColor = animal.color;
  let cheekColor = animal.cheek || '#FDA4AF';
  let animClass = "duo-mascot-neutral";

  if (state === 'happy') {
    animClass = "duo-mascot-happy";
  } else if (state === 'sad') {
    animClass = "duo-mascot-sad";
  } else if (state === 'thinking') {
    animClass = "duo-mascot-thinking";
  } else if (state === 'sleeping') {
    animClass = "duo-mascot-sleeping";
  } else if (state === 'studying') {
    animClass = "duo-mascot-studying";
  }

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!speech) return;
    try {
      const synth = window.speechSynthesis;
      if (synth.speaking) {
        synth.cancel();
      }
      const cleanText = speech.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      synth.speak(utterance);
    } catch (err) {
      console.error(err);
    }
  };

  let wingLeft = "M18 58 C8 65 12 75 22 64 Z";
  let wingRight = "M82 58 C92 65 88 75 78 64 Z";

  if (state === 'happy') {
    wingLeft = "M18 58 C8 45 12 35 22 52 Z";
    wingRight = "M82 58 C92 45 88 35 78 52 Z";
  } else if (animal.type === 'fish' || animal.type === 'whale') {
    wingLeft = "M20 58 C10 50 15 45 22 52 Z";
    wingRight = "M80 58 C90 50 85 45 78 52 Z";
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {speech && (
        <div 
          className="mascot-bubble"
          onClick={handleSpeak}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}
          title="Telaffuzu Dinlemek için Tıkla 🔊"
        >
          <span>{speech}</span>
          <i className="fa-solid fa-volume-high text-indigo-400" style={{ fontSize: '0.8rem' }}></i>
        </div>
      )}
      <div 
        className={`duo-mascot-container ${animClass}`} 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          position: isFloating ? 'fixed' : 'relative',
          bottom: isFloating ? '110px' : 'auto',
          right: isFloating ? '25px' : 'auto',
          zIndex: isFloating ? 999 : 1,
          animation: isFloating ? undefined : 'none'
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="50" cy="94" rx="20" ry="4" fill="rgba(0,0,0,0.15)" />

          {/* BACKPACKS / BACKGROUND GEAR (Hero Cape) */}
          {config.clothing === 'cape' && (
            <path d="M25 55 L10 82 L35 90 Z M75 55 L90 82 L65 90 Z" fill="#EF4444" />
          )}

          {/* BUTTERFLY WINGS */}
          {animal.type === 'butterfly' && (
            <g opacity="0.85">
              <path d="M30 55 C10 30 5 70 30 75 Z" fill="#C084FC" stroke="#E9D5FF" strokeWidth="1" />
              <path d="M70 55 C90 30 95 70 70 75 Z" fill="#C084FC" stroke="#E9D5FF" strokeWidth="1" />
            </g>
          )}

          {/* MOSQUITO WINGS */}
          {animal.type === 'mosquito' && (
            <g opacity="0.6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1">
              <ellipse cx="25" cy="40" rx="6" ry="18" transform="rotate(-30 25 40)" />
              <ellipse cx="75" cy="40" rx="6" ry="18" transform="rotate(30 75 40)" />
            </g>
          )}

          {/* ANIMAL TAILS */}
          {animal.type === 'fish' && (
            <path d="M50 85 L42 96 L50 91 L58 96 Z" fill={bodyColor} />
          )}
          {animal.type === 'whale' && (
            <path d="M50 80 C60 90, 75 90, 80 85 C85 80, 85 92, 90 94 C70 94, 60 88, 50 80 Z" fill={bodyColor} />
          )}

          {/* MAIN BODY SHAPES */}
          {animal.type === 'starfish' ? (
            <path d="M50 15 L60 40 L85 45 L65 65 L70 90 L50 75 L30 90 L35 65 L15 45 L40 40 Z" fill={bodyColor} />
          ) : animal.type === 'snail' ? (
            <>
              <circle cx="36" cy="62" r="16" fill="#FDBA74" stroke="#F97316" strokeWidth="2.5" />
              <circle cx="36" cy="62" r="10" fill="#FED7AA" />
              <path d="M20 78 C25 68 50 68 75 78 L80 78 C80 72 75 72 70 72 Z" fill="#FFFDF0" />
            </>
          ) : animal.type === 'whale' ? (
            <path d="M15 55 C15 30 75 25 88 45 C94 50 98 45 98 50 C98 58 92 60 82 65 C70 72 30 72 15 55 Z" fill={bodyColor} />
          ) : animal.type === 'mosquito' ? (
            <ellipse cx="50" cy="58" rx="15" ry="24" fill={bodyColor} />
          ) : animal.type === 'snake' ? (
            <path d="M50 25 C30 25 25 45 50 45 C75 45 70 65 50 65 C30 65 30 85 50 85 C70 85 75 78 80 82" stroke={bodyColor} strokeWidth="18" strokeLinecap="round" fill="none" />
          ) : (
            <ellipse cx="50" cy="55" rx="33" ry="34" fill={bodyColor} style={{ transition: 'fill 0.3s ease' }} />
          )}

          {/* WATER SPRAY FOR WHALE */}
          {animal.type === 'whale' && (
            <g stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.8">
              <path d="M50 26 Q50 12 45 14" />
              <path d="M50 26 Q54 10 58 12" />
            </g>
          )}

          {/* STRIPES / SPOTS */}
          {animal.stripes && (
            <g opacity="0.35">
              <path d="M25 45 L35 45 M75 45 L65 45" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <path d="M22 55 L32 55 M78 55 L68 55" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          {animal.spots && (
            <g fill="#1E293B" opacity="0.2">
              <circle cx="32" cy="40" r="3" />
              <circle cx="68" cy="40" r="3" />
              <circle cx="50" cy="74" r="4" />
            </g>
          )}

          {/* INNER BELLY */}
          {animal.type !== 'starfish' && animal.type !== 'snail' && animal.type !== 'snake' && animal.type !== 'mosquito' && (
            <ellipse cx="50" cy="62" rx="20" ry="20" fill="#FFFDF0" />
          )}

          {/* ROSY CHEEKS */}
          <circle cx="28" cy="58" r="5" fill={cheekColor} opacity="0.75" />
          <circle cx="72" cy="58" r="5" fill={cheekColor} opacity="0.75" />

          {/* ANIMAL EARS & HORNS */}
          {animal.type === 'pointy' && (
            <>
              <polygon points="18,28 26,10 38,25" fill={bodyColor} />
              <polygon points="21,26 27,14 34,24" fill="#FDA4AF" />
              <polygon points="82,28 74,10 62,25" fill={bodyColor} />
              <polygon points="79,26 73,14 66,24" fill="#FDA4AF" />
            </>
          )}
          {animal.type === 'bear' && (
            <>
              <circle cx="25" cy="24" r="8" fill={bodyColor} />
              <circle cx="25" cy="24" r="4" fill="#FDA4AF" />
              <circle cx="75" cy="24" r="8" fill={bodyColor} />
              <circle cx="75" cy="24" r="4" fill="#FDA4AF" />
            </>
          )}
          {animal.type === 'panda' && (
            <>
              <circle cx="25" cy="24" r="8" fill="#1E293B" />
              <circle cx="75" cy="24" r="8" fill="#1E293B" />
            </>
          )}
          {animal.type === 'koala' && (
            <>
              <circle cx="20" cy="28" r="11" fill="#64748B" />
              <circle cx="20" cy="28" r="6" fill="#FFFDF0" />
              <circle cx="80" cy="28" r="11" fill="#64748B" />
              <circle cx="80" cy="28" r="6" fill="#FFFDF0" />
            </>
          )}
          {animal.type === 'long-ears' && (
            <>
              <ellipse cx="28" cy="15" rx="5" ry="14" fill={bodyColor} transform="rotate(-10 28 15)" />
              <ellipse cx="28" cy="15" rx="2.5" ry="10" fill="#FDA4AF" transform="rotate(-10 28 15)" />
              <ellipse cx="72" cy="15" rx="5" ry="14" fill={bodyColor} transform="rotate(10 72 15)" transform-origin="72 15" />
              <ellipse cx="72" cy="15" rx="2.5" ry="10" fill="#FDA4AF" transform="rotate(10 72 15)" transform-origin="72 15" />
            </>
          )}
          {animal.type === 'horned' && (
            <>
              <path d="M22 25 Q15 10 8 18" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M78 25 Q85 10 92 18" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          )}
          {animal.type === 'lion' && (
            <circle cx="50" cy="52" r="39" fill="#D97706" opacity="0.4" style={{ zIndex: -1 }} />
          )}

          {/* LADYBUG SPOTS */}
          {animal.type === 'ladybug' && (
            <g fill="#1E293B">
              <circle cx="36" cy="62" r="3" />
              <circle cx="64" cy="62" r="3" />
              <circle cx="50" cy="72" r="3" />
            </g>
          )}

          {/* EYES */}
          {state === 'sleeping' ? (
            <>
              <path d="M28 48 Q35 54 42 48" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M58 48 Q65 54 72 48" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          ) : state === 'happy' ? (
            <>
              <path d="M28 48 Q35 40 42 48" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M58 48 Q65 40 72 48" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          ) : state === 'sad' ? (
            <>
              <circle cx="35" cy="48" r="8" fill="white" />
              <circle cx="35" cy="50" r="4.5" fill="#1E293B" />
              <circle cx="65" cy="48" r="8" fill="white" />
              <circle cx="65" cy="50" r="4.5" fill="#1E293B" />
              <path d="M27 38 L39 42" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M73 38 L61 42" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : state === 'thinking' ? (
            <>
              <circle cx="35" cy="48" r="8" fill="white" />
              <circle cx="38" cy="44" r="4.5" fill="#1E293B" />
              <circle cx="65" cy="48" r="8" fill="white" />
              <circle cx="62" cy="44" r="4.5" fill="#1E293B" />
              <path d="M28 38 Q35 34 42 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M58 42 L72 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="35" cy="48" r="8" fill="white" />
              <circle cx="35" cy="48" r="4.5" fill="#1E293B" />
              <circle cx="37" cy="45" r="1.5" fill="white" />
              <circle cx="65" cy="48" r="8" fill="white" />
              <circle cx="65" cy="48" r="4.5" fill="#1E293B" />
              <circle cx="67" cy="45" r="1.5" fill="white" />
            </>
          )}

          {/* SNOUTS / MOUTHS / BEAKS / PROBOSCIS */}
          {animal.type === 'bill' ? (
            <path d="M40 48 C40 45 60 45 60 48 C60 55 40 55 40 48 Z" fill="#F97316" />
          ) : animal.type === 'pig' ? (
            <ellipse cx="50" cy="51" rx="7" ry="5" fill="#F472B6" stroke="#DB2626" strokeWidth="1.5" />
          ) : animal.type === 'trunk' ? (
            <path d="M50 48 Q50 68 38 68" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" fill="none" />
          ) : animal.type === 'frog' ? (
            <path d="M38 52 Q50 62 62 52" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : animal.type === 'mosquito' ? (
            <line x1="50" y1="52" x2="50" y2="76" stroke="#334155" strokeWidth="2.5" />
          ) : animal.type === 'snake' ? (
            <path d="M50 20 L50 12 M50 12 L47 8 M50 12 L53 8" stroke="#EF4444" strokeWidth="1.5" />
          ) : (
            <polygon points="50,53 45,46 55,46" fill="#F97316" />
          )}

          {/* CLOTHING LAYER */}
          {config.clothing === 'shirt' && (
            <path d="M30 65 L70 65 L66 84 L34 84 Z" fill="#EF4444" />
          )}
          {config.clothing === 'hoodie' && (
            <path d="M28 62 L72 62 L68 84 L32 84 Z" fill="#3B82F6" />
          )}
          {config.clothing === 'suit' && (
            <g>
              <path d="M30 65 L70 65 L66 84 L34 84 Z" fill="#1E293B" />
              <polygon points="50,65 42,75 58,75" fill="white" />
              <line x1="50" y1="75" x2="50" y2="82" stroke="#EF4444" strokeWidth="2.5" />
            </g>
          )}
          {config.clothing === 'bowtie' && (
            <path d="M42 55 L58 63 L58 55 L42 63 Z" fill="#EF4444" />
          )}
          {config.clothing === 'scarf' && (
            <path d="M30 55 Q50 65 70 55 L68 62 Q50 72 32 62 Z" fill="#DC2626" stroke="white" strokeWidth="1.5" />
          )}
          {config.clothing === 'tux' && (
            <g>
              <path d="M28 62 L72 62 L68 84 L32 84 Z" fill="#0f172a" />
              <polygon points="50,62 40,78 60,78" fill="white" />
              <polygon points="50,66 46,70 54,70" fill="black" />
            </g>
          )}
          {config.clothing === 'doctor' && (
            <g fill="#F8FAFC" stroke="#cbd5e1" strokeWidth="1">
              <path d="M28 62 L72 62 L68 84 L32 84 Z" />
              <path d="M45 62 L38 84 M55 62 L62 84" stroke="#e2e8f0" strokeWidth="2.5" />
              <circle cx="50" cy="74" r="5" fill="none" stroke="#475569" strokeWidth="1.5" />
            </g>
          )}
          {config.clothing === 'space' && (
            <g fill="#e2e8f0">
              <path d="M28 62 L72 62 L68 84 L32 84 Z" />
              <rect x="44" y="66" width="12" height="10" rx="1.5" fill="#3b82f6" />
            </g>
          )}
          {config.clothing === 'detectivecoat' && (
            <path d="M28 62 L72 62 L68 84 L32 84 Z" fill="#78350F" />
          )}
          {config.clothing === 'kimono' && (
            <g>
              <path d="M28 62 L72 62 L68 84 L32 84 Z" fill="#dc2626" />
              <rect x="30" y="72" width="40" height="6" fill="#fbbf24" />
            </g>
          )}
          {config.clothing === 'pyjamas' && (
            <g fill="#7dd3fc">
              <path d="M28 62 L72 62 L68 84 L32 84 Z" />
              <circle cx="40" cy="70" r="1.5" fill="#fbbf24" />
              <circle cx="60" cy="76" r="1.5" fill="#fbbf24" />
            </g>
          )}

          {/* GLASSES ACCESSORY */}
          {config.glasses === 'cool' && (
            <g fill="#111" stroke="#333" strokeWidth="1.5">
              <rect x="25" y="42" width="22" height="10" rx="3" />
              <rect x="53" y="42" width="22" height="10" rx="3" />
              <line x1="47" y1="46" x2="53" y2="46" stroke="#333" strokeWidth="2" />
            </g>
          )}
          {config.glasses === 'nerd' && (
            <g fill="none" stroke="#1E293B" strokeWidth="2.5">
              <circle cx="35" cy="48" r="10" />
              <circle cx="65" cy="48" r="10" />
              <line x1="45" y1="48" x2="55" y2="48" />
            </g>
          )}
          {config.glasses === 'monocle' && (
            <g fill="none" stroke="#D97706" strokeWidth="2">
              <circle cx="65" cy="48" r="9" />
              <path d="M74 48 Q85 55 80 80" />
            </g>
          )}
          {config.glasses === 'star' && (
            <g fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5">
              <polygon points="35,38 38,44 45,45 40,50 41,56 35,53 29,56 30,50 25,45 32,44" />
              <polygon points="65,38 68,44 75,45 70,50 71,56 65,53 59,56 60,50 55,45 62,44" />
              <line x1="44" y1="45" x2="56" y2="45" stroke="#CA8A04" strokeWidth="2" />
            </g>
          )}
          {config.glasses === 'heart' && (
            <g fill="#f43f5e" stroke="#e11d48" strokeWidth="1.5">
              <path d="M28 44 C25 40, 31 38, 35 41 C39 38, 45 40, 42 44 L35 50 Z" />
              <path d="M58 44 C55 40, 61 38, 65 41 C69 38, 75 40, 72 44 L65 50 Z" />
              <line x1="42" y1="44" x2="55" y2="44" stroke="#e11d48" strokeWidth="2" />
            </g>
          )}
          {config.glasses === 'laser' && (
            <rect x="22" y="44" width="56" height="8" rx="2" fill="#ef4444" opacity="0.9" />
          )}
          {config.glasses === 'glasses3d' && (
            <g stroke="#e2e8f0" strokeWidth="1.5">
              <rect x="25" y="42" width="22" height="10" rx="2" fill="#ef4444" />
              <rect x="53" y="42" width="22" height="10" rx="2" fill="#3b82f6" />
            </g>
          )}
          {config.glasses === 'eyepatch' && (
            <g fill="#1e293b">
              <circle cx="35" cy="48" r="9" />
              <line x1="20" y1="38" x2="50" y2="52" stroke="#1e293b" strokeWidth="2" />
            </g>
          )}

          {/* HATS ACCESSORY */}
          {config.hat === 'cowboy' && (
            <g fill="#78350F">
              <ellipse cx="50" cy="24" rx="28" ry="4" />
              <path d="M30 22 C30 8 70 8 70 22 Z" />
            </g>
          )}
          {config.hat === 'crown' && (
            <g fill="#F59E0B" stroke="#D97706" strokeWidth="1">
              <path d="M30 25 L35 12 L50 20 L65 12 L70 25 Z" />
              <circle cx="35" cy="11" r="1.5" fill="#EF4444" />
              <circle cx="50" cy="19" r="1.5" fill="#3B82F6" />
              <circle cx="65" cy="11" r="1.5" fill="#EF4444" />
            </g>
          )}
          {config.hat === 'wizard' && (
            <g fill="#4F46E5">
              <ellipse cx="50" cy="24" rx="26" ry="3" />
              <path d="M32 23 L50 2 L68 23 Z" />
              <polygon points="50,8 52,11 55,10 53,13 55,15 52,14 50,17 48,14 45,15 47,13 45,10 48,11" fill="#FDE047" />
            </g>
          )}
          {config.hat === 'baseball' && (
            <g>
              <path d="M30 24 C30 12 70 12 70 24 Z" fill="#EF4444" />
              <path d="M68 24 L86 24 L84 27 L66 27 Z" fill="#B91C1C" />
            </g>
          )}
          {config.hat === 'detective' && (
            <g fill="#78350F">
              <path d="M28 24 C28 14 72 14 72 24 Z" />
              <ellipse cx="50" cy="25" rx="25" ry="3.5" />
            </g>
          )}
          {config.hat === 'beanie' && (
            <g>
              <path d="M30 26 C30 14 70 14 70 26 Z" fill="#0EA5E9" />
              <circle cx="50" cy="12" r="4" fill="white" />
              <rect x="28" y="23" width="44" height="4" rx="2" fill="#38BDF8" />
            </g>
          )}
          {config.hat === 'chef' && (
            <g fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5">
              <path d="M34 26 L66 26 L62 20 C68 15 58 5 50 10 C42 5 32 15 38 20 Z" />
              <rect x="34" y="22" width="32" height="4" fill="#E2E8F0" />
            </g>
          )}
          {config.hat === 'pirate' && (
            <g fill="#1e293b">
              <path d="M25 24 C25 12, 75 12, 75 24 Z" />
              <rect x="30" y="23" width="40" height="2" fill="white" />
            </g>
          )}
          {config.hat === 'viking' && (
            <g fill="#94a3b8">
              <path d="M30 24 C30 14 70 14 70 24 Z" />
              <path d="M32 20 Q20 10 24 6" stroke="#f8fafc" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M68 20 Q80 10 76 6" stroke="#f8fafc" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>
          )}
          {config.hat === 'santa' && (
            <g>
              <path d="M30 24 Q50 6 70 24 Z" fill="#ef4444" />
              <circle cx="68" cy="22" r="4.5" fill="white" />
              <rect x="28" y="23" width="44" height="4" rx="2" fill="white" />
            </g>
          )}
          {config.hat === 'grad' && (
            <g fill="#1e293b">
              <polygon points="50,12 25,18 50,24 75,18" />
              <rect x="47" y="22" width="6" height="4" />
              <line x1="70" y1="19" x2="72" y2="28" stroke="#fbbf24" strokeWidth="2" />
            </g>
          )}
          {config.hat === 'sombrero' && (
            <g fill="#eab308">
              <ellipse cx="50" cy="24" rx="36" ry="6" />
              <path d="M38 22 C38 10 62 10 62 22 Z" />
            </g>
          )}
          {config.hat === 'tophat' && (
            <g fill="#0f172a">
              <ellipse cx="50" cy="24" rx="24" ry="3.5" />
              <rect x="34" y="8" width="32" height="15" />
              <rect x="34" y="21" width="32" height="2" fill="#ef4444" />
            </g>
          )}

          {/* WINGS / FLIPPERS (Drawn in front of clothing) */}
          {animal.type !== 'starfish' && animal.type !== 'snail' && animal.type !== 'snake' && (
            <>
              <path d={wingLeft} fill={bodyColor} style={{ transition: 'all 0.3s ease' }} />
              <path d={wingRight} fill={bodyColor} style={{ transition: 'all 0.3s ease' }} />
            </>
          )}

          {/* FEET / LEGS */}
          {animal.type !== 'fish' && animal.type !== 'whale' && animal.type !== 'starfish' && animal.type !== 'snail' && animal.type !== 'snake' && (
            <>
              <circle cx="40" cy="91" r="3.5" fill="#F97316" />
              <circle cx="60" cy="91" r="3.5" fill="#F97316" />
            </>
          )}

          {/* HELD ITEMS (Drawn on right-hand wing position) */}
          {config.item === 'wand' && (
            <g>
              <line x1="75" y1="65" x2="88" y2="45" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <polygon points="88,42 90,45 93,44 91,47 93,49 90,48 88,51 87,48 84,49 86,47 84,44 87,45" fill="#FDE047" />
            </g>
          )}
          {config.item === 'sword' && (
            <g>
              <line x1="75" y1="65" x2="90" y2="40" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="73" y1="60" x2="81" y2="55" stroke="#D97706" strokeWidth="2.5" />
            </g>
          )}
          {config.item === 'book' && (
            <g fill="#EF4444" stroke="#B91C1C" strokeWidth="1">
              <rect x="70" y="55" width="16" height="20" rx="2" transform="rotate(15 70 55)" />
              <rect x="72" y="57" width="12" height="16" fill="white" transform="rotate(15 70 55)" />
            </g>
          )}
          {config.item === 'mug' && (
            <g fill="#93C5FD">
              <rect x="72" y="60" width="12" height="14" rx="2" />
              <path d="M84 64 A 3 3 0 0 1 84 70" fill="none" stroke="#93C5FD" strokeWidth="2.5" />
            </g>
          )}
          {config.item === 'shield' && (
            <circle cx="80" cy="65" r="9" fill="#2563eb" stroke="#e2e8f0" strokeWidth="1.5" />
          )}
          {config.item === 'trophy' && (
            <g fill="#eab308">
              <path d="M74 56 L86 56 L83 70 L77 70 Z" />
              <line x1="80" y1="70" x2="80" y2="74" stroke="#eab308" strokeWidth="2.5" />
              <rect x="76" y="74" width="8" height="2" />
            </g>
          )}
          {config.item === 'palette' && (
            <ellipse cx="80" cy="65" rx="8" ry="6" fill="#b45309" />
          )}
          {config.item === 'mic' && (
            <g stroke="#94a3b8" strokeWidth="2.5">
              <line x1="78" y1="68" x2="82" y2="56" />
              <circle cx="82" cy="54" r="3.5" fill="#475569" stroke="none" />
            </g>
          )}
          {config.item === 'laptop' && (
            <g fill="#475569">
              <rect x="68" y="68" width="18" height="2" />
              <rect x="70" y="58" width="14" height="10" rx="1" fill="#94a3b8" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default MascotPet;
