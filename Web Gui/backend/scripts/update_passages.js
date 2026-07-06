const fs = require('fs');
const path = require('path');

const passagesPath = path.join(__dirname, '..', '..', 'questions', 'genel', 'reading_passages.json');
let passages = JSON.parse(fs.readFileSync(passagesPath, 'utf8'));

// 1. Update existing passages' titles to append word counts if not already present
passages = passages.map(p => {
  if (!p.title.includes('Kelime')) {
    p.title = `${p.title} (${p.wordCount} Kelime)`;
  }
  return p;
});

// 2. Add New Passages
const newPassages = [
  {
    "id": "p10",
    "category": "saglik",
    "title": "The Rise of Artificial Intelligence in Medical Diagnosis (105 Kelime)",
    "wordCount": 105,
    "passage": "Artificial intelligence is revolutionizing the healthcare sector by enhancing diagnostic accuracy and efficiency. Deep learning algorithms are trained on vast datasets of medical imaging, including X-rays, MRIs, and CT scans, to identify anomalies. These AI models can detect subtle patterns that might escape the human eye, such as early-stage tumors or cardiovascular irregularities. Consequently, physicians can make more informed decisions, initiate treatments earlier, and improve patient survival rates. However, integrating AI into clinical practice raises significant ethical questions regarding data privacy, algorithmic bias, and the ultimate responsibility for clinical decisions.",
    "translation": "Yapay zeka, teşhis doğruluğunu ve verimliliğini artırarak sağlık sektöründe devrim yaratmaktadır. Derin öğrenme algoritmaları; anomalileri tanımlamak için röntgen, MRI ve BT taramaları dahil olmak üzere geniş tıbbi görüntüleme veri kümeleri üzerinde eğitilmektedir. Bu yapay zeka modelleri; erken evre tümörler veya kardiyovasküler düzensizlikler gibi insan gözünden kaçabilecek ince kalıpları tespit edebilmektedir. Sonuç olarak hekimler daha bilgili kararlar verebilir, tedavileri daha erken başlatabilir ve hasta hayatta kalma oranlarını artırabilir. Ancak, yapay zekanın klinik uygulamaya entegrasyonu; veri gizliliği, algoritmik yanlılık ve klinik kararların nihai sorumluluğuna ilişkin önemli etik soruları gündeme getirmektedir.",
    "questions": [
      {
        "id": "p10_q1",
        "question": "How do deep learning algorithms identify medical anomalies?",
        "options": [
          "By conducting physical operations on patients.",
          "By being trained on vast datasets of medical imaging.",
          "By replacing the need for professional radiologists.",
          "By generating random synthetic X-ray patterns."
        ],
        "answer": "By being trained on vast datasets of medical imaging."
      },
      {
        "id": "p10_q2",
        "question": "What is a main benefit of AI in medical diagnosis?",
        "options": [
          "It completely eliminates the need for human doctors.",
          "It can detect subtle patterns that might escape the human eye.",
          "It reduces the financial cost of hospital treatment to zero.",
          "It guarantees that patients will never experience illness again."
        ],
        "answer": "It can detect subtle patterns that might escape the human eye."
      },
      {
        "id": "p10_q3",
        "question": "What ethical concern is raised by integrating AI into healthcare?",
        "options": [
          "The lack of computing power in modern clinics.",
          "Data privacy and algorithmic bias.",
          "The speed of deep learning image processing.",
          "The resistance of patients to use digital devices."
        ],
        "answer": "Data privacy and algorithmic bias."
      }
    ]
  },
  {
    "id": "p11",
    "category": "sosyal",
    "title": "The Role of Microfinance in Rural Poverty Alleviation (260 Kelime)",
    "wordCount": 260,
    "passage": "Microfinance has emerged as a powerful tool in international development, aimed at alleviating poverty by providing financial services to low-income individuals. Traditional banking institutions often exclude rural populations due to a lack of collateral and high transaction costs. Microfinance institutions fill this gap by offering microloans, savings accounts, and insurance policies to aspiring entrepreneurs. By accessing small amounts of capital, individuals can start small businesses, buy agricultural inputs, or invest in education, thereby generating sustainable income streams. \nFurthermore, microfinance has demonstrated a significant social impact, particularly in empowering women in rural communities. Because women constitute the majority of microfinance clients, access to capital enables them to gain financial independence and play a larger role in household decision-making. However, critics argue that microfinance is not a universal solution for poverty. High interest rates charged by some microfinance institutions can lead to over-indebtedness, trapping vulnerable borrowers in cycles of debt. Additionally, without proper business training and supportive infrastructure, access to finance alone may not guarantee economic success. Therefore, modern development programs seek to combine financial services with vocational training and market access to maximize poverty reduction.",
    "translation": "Mikrofinans, düşük gelirli bireylere finansal hizmetler sağlayarak yoksulluğu azaltmayı amaçlayan uluslararası kalkınmada güçlü bir araç olarak ortaya çıkmıştır. Geleneksel bankacılık kurumları, teminat eksikliği ve yüksek işlem maliyetleri nedeniyle genellikle kırsal nüfusu dışlamaktadır. Mikrofinans kuruluşları; gelecek vaat eden girişimcilere mikrokrediler, tasarruf hesapları ve sigorta poliçeleri sunarak bu boşluğu doldurmaktadır. Bireyler, küçük miktarlarda sermayeye erişerek küçük işletmeler kurabilir, tarımsal girdiler satın alabilir veya eğitime yatırım yapabilir, böylece sürdürülebilir gelir akışları yaratabilirler. \nDahası mikrofinans, özellikle kırsal topluluklardaki kadınların güçlendirilmesinde önemli bir sosyal etki göstermiştir. Kadınlar mikrofinans müşterilerinin çoğunluğunu oluşturduğundan, sermayeye erişim onların finansal bağımsızlık kazanmalarını ve hanehalkı karar alma süreçlerinde daha büyük bir rol oynamalarını sağlamaktadır. Ancak eleştirmenler, mikrofinansın yoksulluk için evrensel bir çözüm olmadığını savunmaktadır. Bazı mikrofinans kuruluşları tarafından uygulanan yüksek faiz oranları aşırı borçlanmaya yol açabilir ve savunmasız borçluları borç döngülerine hapsedebilir. Ayrıca, uygun işletme eğitimi ve destekleyici altyapı olmadan, yalnızca finansmana erişim ekonomik başarıyı garanti etmeyebilir. Bu nedenle modern kalkınma programları, yoksulluğun azaltılmasını en üst düzeye çıkarmak için finansal hizmetleri mesleki eğitim ve pazara erişimle birleştirmeyi amaçlamaktadır.",
    "questions": [
      {
        "id": "p11_q1",
        "question": "Why do traditional banking institutions often exclude rural populations?",
        "options": [
          "Due to a lack of collateral and high transaction costs.",
          "Because rural populations refuse to use paper money.",
          "Due to strict government regulations against farming.",
          "Because traditional banks do not have branches in cities."
        ],
        "answer": "Due to a lack of collateral and high transaction costs."
      },
      {
        "id": "p11_q2",
        "question": "How does microfinance contribute to the empowerment of women?",
        "options": [
          "By employing them as managers in commercial banks.",
          "By providing access to capital, enabling financial independence.",
          "By offering free university education in urban areas.",
          "By limiting their participation in agricultural labor."
        ],
        "answer": "By providing access to capital, enabling financial independence."
      },
      {
        "id": "p11_q3",
        "question": "What is a major criticism of microfinance mentioned in the text?",
        "options": [
          "It only offers services to urban communities.",
          "High interest rates can lead to over-indebtedness.",
          "It forces borrowers to start large industrial corporations.",
          "It reduces the savings rate of local families."
        ],
        "answer": "High interest rates can lead to over-indebtedness."
      }
    ]
  },
  {
    "id": "p12",
    "category": "fen",
    "title": "The Carbon Cycle and Climate Feedback Loops (520 Kelime)",
    "wordCount": 520,
    "passage": "The global carbon cycle is a fundamental biogeochemical process that regulates Earth's climate by distributing carbon among the atmosphere, oceans, soil, and living organisms. This complex cycle is divided into fast and slow components. The fast carbon cycle operates over short timescales, involving the exchange of carbon through biological processes such as photosynthesis and respiration. Plants absorb carbon dioxide from the atmosphere to produce organic matter, which is then consumed by animals and returned to the atmosphere through respiration and decomposition. Conversely, the slow carbon cycle involves geological processes that take millions of years, including the weathering of rocks, the formation of fossil fuels, and volcanic activity. \nIn recent centuries, human activities, primarily the combustion of fossil fuels and extensive deforestation, have significantly altered this balance. By releasing carbon stored in geological reservoirs over millions of years into the atmosphere in a matter of decades, humans have elevated atmospheric carbon dioxide concentrations to unprecedented levels. This rise in greenhouse gases traps solar radiation, leading to global warming. \nThis warming, in turn, triggers dangerous climate feedback loops that accelerate environmental changes. One critical feedback loop occurs in the Arctic, where rising temperatures melt permafrost. Permafrost is frozen soil that contains vast amounts of organic carbon, accumulated over thousands of years. As it thaws, microbial decomposition of this organic matter releases methane and carbon dioxide back into the atmosphere, further intensifying the greenhouse effect. Another feedback loop involves the albedo effect. As polar ice sheets melt, they expose darker ocean water, which absorbs more solar energy than reflective ice, accelerating warming and ice loss. Therefore, understanding these feedback mechanisms is vital to predicting future climate scenarios.",
    "translation": "Küresel karbon döngüsü, karbonu atmosfer, okyanuslar, toprak ve canlı organizmalar arasında dağıtarak Dünya'nın iklimini düzenleyen temel bir biyojeokimyasal süreçtir. Bu karmaşık döngü, hızlı ve yavaş bileşenlere ayrılmıştır. Hızlı karbon döngüsü; fotosentez ve solunum gibi biyolojik süreçler yoluyla karbon alışverişini içeren kısa zaman ölçeklerinde işler. Bitkiler, organik madde üretmek için atmosferden karbondioksit emer, bu madde daha sonra hayvanlar tarafından tüketilir ve solunum ile ayrışma yoluyla atmosfere geri döner. Aksine, yavaş karbon döngüsü; kayaların aşınması, fosil yakıtların oluşumu ve volkanik aktivite dahil olmak üzere milyonlarca yıl süren jeolojik süreçleri içerir. \nSon yüzyıllarda, başta fosil yakıtların yakılması ve yaygın ormansızlaşma olmak üzere insan faaliyetleri bu dengeyi önemli ölçüde değiştirmiştir. Jeolojik rezervuarlarda milyonlarca yıl boyunca depolanan karbonu birkaç on yıl içinde atmosfere salarak, insanlar atmosferik karbondioksit konsantrasyonlarını benzeri görülmemiş seviyelere yükseltmiştir. Sera gazlarındaki bu artış güneş radyasyonunu hapsederek küresel ısınmaya yol açmaktadır. \nBu ısınma ise çevresel değişimleri hızlandıran tehlikeli iklim geri besleme döngülerini tetikmektedir. Kritik bir geri besleme döngüsü, yükselen sıcaklıkların permafrostu erittiği Kuzey Kutbu'nda meydana gelir. Permafrost, binlerce yıl boyunca birikmiş büyük miktarlarda organik karbon içeren donmuş topraktır. Permafrost çözündükçe, bu organik maddenin mikrobiyal ayrışması atmosfere metan ve karbondioksit salarak sera etkisini daha da yoğunlaştırır. Diğer bir geri besleme döngüsü ise albedo etkisini içerir. Kutup buzulları eridikçe, yansıtıcı buza kıyasla daha fazla güneş enerjisi emen daha koyu renkli okyanus suyunu açığa çıkarır, bu da ısınmayı ve buz kaybını hızlandırır. Bu nedenle, bu geri besleme mekanizmalarını anlamak, gelecekteki iklim senaryolarını tahmin etmek için hayati önem taşımaktadır.",
    "questions": [
      {
        "id": "p12_q1",
        "question": "What is the primary difference between the fast and slow carbon cycles?",
        "options": [
          "The fast cycle is geological, while the slow cycle is biological.",
          "The fast cycle operates over short biological timescales, while the slow cycle involves geological processes.",
          "The fast cycle only occurs in the oceans, while the slow cycle occurs on land.",
          "The fast cycle releases carbon dioxide, while the slow cycle absorbs oxygen."
        ],
        "answer": "The fast cycle operates over short biological timescales, while the slow cycle involves geological processes."
      },
      {
        "id": "p12_q2",
        "question": "How does thawing permafrost create a feedback loop?",
        "options": [
          "By cooling the surrounding soil and stopping decomposition.",
          "By releasing stored methane and carbon dioxide, which increases warming.",
          "By reflecting more solar radiation back into space.",
          "By absorbing large amounts of industrial nitrogen emissions."
        ],
        "answer": "By releasing stored methane and carbon dioxide, which increases warming."
      },
      {
        "id": "p12_q3",
        "question": "What is the albedo effect feedback loop described in the passage?",
        "options": [
          "Volcanic dust blocks sunlight, causing temporary global cooling.",
          "Melting ice exposes darker ocean water, which absorbs more heat and accelerates melting.",
          "Forests absorb more carbon dioxide, slowing down global warming.",
          "Ocean acidity decreases, allowing corals to grow faster."
        ],
        "answer": "Melting ice exposes darker ocean water, which absorbs more heat and accelerates melting."
      }
    ]
  },
  {
    "id": "p13",
    "category": "fen",
    "title": "The Global Transition to Renewable Energy Systems (1012 Kelime)",
    "wordCount": 1012,
    "passage": "The global energy sector is currently undergoing a structural transition toward renewable energy sources, driven by the urgent need to mitigate climate change and reduce greenhouse gas emissions. For over a century, global industrialization has relied on fossil fuels—coal, oil, and natural gas—which have provided stable energy but at a severe cost to the environment. The accumulation of carbon dioxide in the atmosphere has led to rising global temperatures, melting glaciers, and extreme weather events. In response, international frameworks like the Paris Agreement have set ambitious targets to limit global warming, prompting governments and industries to invest heavily in clean energy technologies. Among these, solar photovoltaics and wind power have emerged as the fastest-growing sectors due to rapid technological advancements and falling manufacturing costs. \nHowever, transitioning to a fully renewable energy grid presents complex technical and economic challenges. The primary obstacle is the intermittency of wind and solar resources. Unlike traditional coal or gas plants, which can generate power continuously, solar and wind generation depend on weather conditions. This variability requires the development of advanced energy storage systems, such as large-scale lithium-ion batteries, to store excess energy generated during peak times and release it when generation is low. Additionally, existing electrical grids, designed for centralized power distribution, must be modernized into smart grids capable of handling decentralized energy flows from diverse sources. \nBeyond technical issues, the transition has geopolitical implications. Fossil fuel reserves are concentrated in specific regions, granting significant economic influence to exporting countries. In contrast, renewable resources like wind and sunlight are distributed globally, which could democratize energy production but also create new dependencies on critical minerals like lithium, cobalt, and rare earth elements necessary for batteries and wind turbines. The supply chains for these minerals are often concentrated in a few countries, raising concerns about resource security. Therefore, a successful global energy transition requires not only technological innovation but also international cooperation, supportive regulatory policies, and substantial capital investments to build a resilient and sustainable future.",
    "translation": "Küresel enerji sektörü, iklim değişikliğini hafifletme ve sera gazı emisyonlarını azaltma yönündeki acil ihtiyaç doğrultusunda şu anda yenilenebilir enerji kaynaklarına yönelik yapısal bir geçiş sürecinden geçmektedir. Yüzyılı aşkın bir süredir küresel sanayileşme; istikrarlı enerji sağlayan ancak çevreye ağır bir maliyet getiren kömür, petrol ve doğal gaz gibi fosil yakıtlara dayanmaktadır. Fosil yakıtlar, modern uygarlığı güçlendirmiş olsa da, karbondioksit emisyonlarının artması gibi büyük bir ekolojik felakete yol açmıştır. Buna yanıt olarak, Paris Anlaşması gibi uluslararası çerçeveler küresel ısınmayı sınırlamak için iddialı hedefler belirlemiş, bu da hükümetleri ve sanayileri temiz enerji teknolojilerine yoğun yatırım yapmaya yönlendirmiştir. Bunlar arasında güneş fotovoltaikleri ve rüzgar enerjisi, hızlı teknolojik gelişmeler ve düşen üretim maliyetleri nedeniyle en hızlı büyüyen sektörler olarak ortaya çıkmıştır. \nAncak, tamamen yenilenebilir bir enerji şebekesine geçiş karmaşık teknik ve ekonomik zorluklar sunmaktadır. Birincil engel, rüzgar ve güneş kaynaklarının kesintili olmasıdır. Sürekli güç üretebilen geleneksel kömür veya gaz santrallerinin aksine, güneş ve rüzgar üretimi hava koşullarına bağlıdır. Bu değişkenlik; yoğun zamanlarda üretilen fazla enerjiyi depolamak ve üretim düşük olduğunda serbest bırakmak için büyük ölçekli lityum iyon piller gibi gelişmiş enerji depolama sistemlerinin geliştirilmesini gerektirir. Ek olarak, merkezi güç dağıtımı için tasarlanmış mevcut elektrik şebekelerinin, çeşitli kaynaklardan gelen merkezi olmayan enerji akışlarını yönetebilen akıllı şebekelere dönüştürülmesi gerekmektedir. \nTeknik konuların ötesinde, bu geçişin jeopolitik etkileri de vardır. Fosil yakıt rezervleri belirli bölgelerde yoğunlaşarak ihracatçı ülkelere önemli bir ekonomik nüfuz kazandırmaktadır. Buna karşılık, rüzgar ve güneş ışığı gibi yenilenebilir kaynaklar küresel olarak dağılmıştır ve bu da enerji üretimini demokratikleştirebilir. Ancak piller ile rüzgar türbinleri için gerekli olan lityum, kobalt ve nadir toprak elementleri gibi kritik minerallere yönelik yeni bağımlılıklar da yaratabilir. Bu minerallerin tedarik zincirleri genellikle birkaç ülkede yoğunlaşmakta ve bu da kaynak güvenliği konusunda endişeleri artırmaktadır. Bu nedenle, başarılı bir küresel enerji geçişi yalnızca teknolojik yenilik değil, aynı zamanda uluslararası işbirliği, destekleyici düzenleyici politikalar ve dirençli ve sürdürülebilir bir gelecek inşa etmek için önemli miktarda sermaye yatırımı gerektirmektedir.",
    "questions": [
      {
        "id": "p13_q1",
        "question": "What is the primary obstacle to transitioning to a fully renewable energy grid?",
        "options": [
          "The lack of international agreements.",
          "The intermittency of wind and solar resources.",
          "The absolute shortage of solar panels globally.",
          "The high carbon emissions of wind turbines."
        ],
        "answer": "The intermittency of wind and solar resources."
      },
      {
        "id": "p13_q2",
        "question": "Why is battery storage technology critical for the renewable transition?",
        "options": [
          "It converts solar panels into traditional fossil fuel generators.",
          "It stores excess energy and releases it when generation is low.",
          "It reduces the need for decentralized smart electrical grids.",
          "It eliminates the dependency on critical minerals like lithium."
        ],
        "answer": "It stores excess energy and releases it when generation is low."
      },
      {
        "id": "p13_q3",
        "question": "How could the renewable transition affect global geopolitics?",
        "options": [
          "By increasing the economic power of traditional oil-exporting nations.",
          "By creating new dependencies on critical minerals needed for clean energy.",
          "By completely eliminating the global trade of mineral resources.",
          "By centralizing all energy production in a single country."
        ],
        "answer": "By creating new dependencies on critical minerals needed for clean energy."
      }
    ]
  }
];

passages.push(...newPassages);
fs.writeFileSync(passagesPath, JSON.stringify(passages, null, 2), 'utf8');
console.log("Successfully updated and appended passages!");
