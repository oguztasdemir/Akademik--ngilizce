# -*- coding: utf-8 -*-
import os
import json

categories = ['fen', 'saglik', 'sosyal']

# Topic templates for 30 days with comprehensive grammatical structures and strategy tips
grammar_data = {
    1: {
        "title": "Present & Past Simple (Zamanlar)",
        "rules": (
            "PRESENT SIMPLE (GENİŞ ZAMAN)\n"
            "- Yapı: S + V1 (he/she/it için -s, -es, -ies takısı alır). Yardımcı fiil: Do / Does.\n"
            "- Pasif Yapı: S + am/is/are + V3\n"
            "- Kullanım: Genel geçer bilimsel gerçekler, doğa kanunları, akademik teoriler, rutinler ve genel gözlemler.\n"
            "- Anahtar Kelimeler: generally, usually, always, routinely, rarely, every year, often.\n\n"
            "PAST SIMPLE (Dİ’Lİ GEÇMİŞ ZAMAN)\n"
            "- Yapı: S + V2 (Düzensiz fiiller değişir, düzenli fiiller -ed alır). Yardımcı fiil: Did.\n"
            "- Pasif Yapı: S + was/were + V3\n"
            "- Kullanım: Geçmişte belirli bir zaman diliminde tamamlanmış ve sona ermiş eylemler, tarihi olaylar, tamamlanmış bilimsel deneylerin sonuçları.\n"
            "- Anahtar Kelimeler: yesterday, ago, last week, in 1999, during the 19th century, once, anciently."
        ),
        "examples": {
            "fen": [
                "Water boils at 100 degrees Celsius under standard atmospheric pressure. (Su, standart atmosfer basıncı altında 100 santigrat derecede kaynar.)",
                "Albert Einstein published his theory of general relativity in 1915. (Albert Einstein, genel görelilik kuramını 1915 yılında yayınladı.)",
                "Gravity pulls objects toward the center of the Earth. (Yerçekimi, nesneleri Dünya'nın merkezine doğru çeker.)",
                "The researchers conducted the experiment last month and recorded the temperature changes. (Araştırmacılar deneyi geçen ay gerçekleştirdi ve sıcaklık değişimlerini kaydetti.)",
                "Plants convert carbon dioxide into oxygen during photosynthesis. (Bitkiler, fotosentez sırasında karbondioksiti oksijene dönüştürür.)",
                "The volcano erupted in 79 AD, destroying the entire surrounding city. (Volkan MS 79 yılında patladı ve çevredeki tüm şehri yok etti.)",
                "Light travels at approximately 300,000 kilometers per second in a vacuum. (Işık, vakumda saniyede yaklaşık 300.000 kilometre hızla seyahat eder.)",
                "Early astronomers believed that the Earth was the center of the universe. (İlk astronomlar Dünya'nın evrenin merkezi olduğuna inandılar.)",
                "Many metals conduct electricity extremely well due to free electrons. (Birçok metal, serbest elektronlar sayesinde elektriği son derece iyi iletir.)",
                "In 1969, Neil Armstrong became the first human to walk on the Moon. (1969'da Neil Armstrong, Ay'da yürüyen ilk insan oldu.)"
            ],
            "saglik": [
                "The human heart beats approximately 100,000 times a day to pump blood. (İnsan kalbi, kan pompalamak için günde yaklaşık 100.000 kez atar.)",
                "Fleming discovered penicillin in 1928, which revolutionized medicine. (Fleming, 1928 yılında tıpta çığır açan penisilini keşfetti.)",
                "Antibiotics destroy bacteria but have no effect on viral infections. (Antibiyotikler bakterileri yok eder ancak viral enfeksiyonlar üzerinde hiçbir etkisi yoktur.)",
                "The patient showed severe symptoms of the virus yesterday. (Hasta dün virüsün şiddetli belirtilerini gösterdi.)",
                "Red blood cells carry oxygen from the lungs to the rest of the body. (Alyuvarlar oksijeni akciğerlerden vücudun geri kalanına taşır.)",
                "Dr. Jonas Salk developed the first successful polio vaccine in 1952. (Dr. Jonas Salk, 1952 yılında ilk başarılı çocuk felci aşısını geliştirdi.)",
                "Regular exercise lowers the risk of developing cardiovascular diseases. (Düzenli egzersiz, kardiyovasküler hastalıklar geliştirme riskini düşürür.)",
                "The Spanish Flu epidemic of 1918 killed millions of people worldwide. (1918'deki İspanyol Gribi salgını dünya çapında milyonlarca insanı öldürdü.)",
                "Insulin regulates the level of glucose in the bloodstream. (İnsülin, kan dolaşımındaki glikoz seviyesini düzenler.)",
                "The surgeons performed the complex transplant operation last week. (Cerrahlar karmaşık nakil ameliyatını geçen hafta gerçekleştirdiler.)"
            ],
            "sosyal": [
                "Governments impose taxes on goods and services to raise public revenue. (Hükümetler, kamu geliri sağlamak amacıyla mal ve hizmetlere vergi uygular.)",
                "The French Revolution began in 1789 and altered the course of modern history. (Fransız Devrimi 1789'da başladı ve modern tarihin akışını değiştirdi.)",
                "Inflation reduces the purchasing power of money over time. (Enflasyon, zamanla paranın satın alma gücünü azaltır.)",
                "The empire collapsed after years of economic decline and internal conflicts. (İmparatorluk, yıllar süren ekonomik gerileme ve iç çatışmalardan sonra çöktü.)",
                "Archaeologists study material remains to understand ancient human societies. (Arkeologlar, eski insan toplumlarını anlamak için maddi kalıntıları inceler.)",
                "The United Nations was established in 1945 to promote global peace. (Birleşmiş Milletler, küresel barışı desteklemek amacıyla 1945 yılında kuruldu.)",
                "Socioeconomic status directly affects a child's access to quality education. (Sosyoekonomik durum, bir çocuğun nitelikli eğitime erişimini doğrudan etkiler.)",
                "Karl Marx wrote 'Das Kapital' to criticize the capitalist economic system. (Karl Marx, kapitalist ekonomik sistemi eleştirmek için 'Das Kapital'i yazdı.)",
                "Democracy grants citizens the right to vote and choose their leaders. (Demokrasi, vatandaşlara oy kullanma ve liderlerini seçme hakkı tanır.)",
                "The Industrial Revolution transformed rural agrarian societies into urban industrial ones. (Sanayi Devrimi, kırsal tarım toplumlarını kentsel sanayi toplumlarına dönüştürdü.)"
            ]
        },
        "strategy": (
            "- Cümlede net bir geçmiş zaman ifadesi (in 1990, during WWI, ago, last century) varsa doğrudan Past Simple (V2) yapısına gidin.\n"
            "- Doğa yasaları, bilimsel gerçekler ve her zaman geçerli olan teoriler anlatılıyorsa Present Simple (V1) işaretleyin.\n"
            "- Pasif yapılarda öznenin eylemi yapıp yapmadığını kontrol edin. Deneyler ve araştırmalar genellikle pasif olarak aktarılır (was conducted, was discovered)."
        )
    },
    2: {
        "title": "Perfect Tenses (Zamanlar)",
        "rules": (
            "PRESENT PERFECT TENSE (YAKIN GEÇMİŞ ZAMAN)\n"
            "- Yapı: S + have/has + V3. Yardımcı fiil: Have / Has.\n"
            "- Pasif Yapı: S + have/has + been + V3\n"
            "- Kullanım: Geçmişte başlayıp günümüzde de etkisi devam eden eylemler, hayat tecrübeleri, yeni tamamlanmış eylemler ve zamansız geçmiş olaylar.\n"
            "- Anahtar Kelimeler: since, for, recently, lately, so far, up to now, already, yet, just.\n\n"
            "PAST PERFECT TENSE (MİŞ'Lİ GEÇMİŞ ZAMAN)\n"
            "- Yapı: S + had + V3. Yardımcı fiil: Had.\n"
            "- Pasif Yapı: S + had + been + V3\n"
            "- Kullanım: Geçmişteki iki olaydan daha önce gerçekleşeni (geçmişin geçmişini) ifade etmek için kullanılır. Genellikle before, after, by the time bağlaçlarıyla kullanılır.\n"
            "- Anahtar Kelimeler: by the time (past), before (past), after (had V3)."
        ),
        "examples": {
            "fen": [
                "Scientists have discovered several new exoplanets in recent years. (Bilim insanları son yıllarda birkaç yeni ötegezegen keşfettiler.)",
                "By the time the probe landed on Mars, it had travelled millions of miles. (Sonda Mars'a indiğinde, milyonlarca mil yol kat etmişti.)",
                "Global temperatures have risen significantly since the industrial era began. (Sanayi çağı başladığından beri küresel sıcaklıklar önemli ölçüde arttı.)",
                "The star had already collapsed before astronomers detected the supernova. (Gökbilimciler süpernovayı tespit etmeden önce yıldız çoktan çökmüştü.)",
                "Research on renewable energy has advanced rapidly over the last decade. (Yenilenebilir enerji araştırmaları son on yılda hızla ilerledi.)",
                "After the researchers had gathered the data, they started the computer simulation. (Araştırmacılar verileri topladıktan sonra bilgisayar simülasyonunu başlattılar.)",
                "Our solar system has existed for approximately 4.6 billion years. (Güneş sistemimiz yaklaşık 4.6 milyar yıldır varlığını sürdürmektedir.)",
                "Chemists had isolated the compound before they realized its toxic properties. (Kimyagerler bileşiğin toksik özelliklerini fark etmeden önce onu izole etmişlerdi.)",
                "The internet has revolutionized global communication since its inception. (İnternet, kurulduğu günden beri küresel iletişimi kökten değiştirdi.)",
                "Before the storm hit the coast, meteorologists had warned the local populations. (Fırtına kıyıya vurmadan önce, meteorologlar yerel halkı uyarmıştı.)"
            ],
            "saglik": [
                "Modern medicine has eradicated smallpox through global vaccination. (Modern tıp, küresel aşılama yoluyla çiçek hastalığını tamamen yok etti.)",
                "By the time they found a cure, the disease had affected thousands of patients. (Tedaviyi bulduklarında, hastalık binlerce hastayı etkilemişti.)",
                "Researchers have made great progress in cancer treatment recently. (Araştırmacılar son zamanlarda kanser tedavisinde büyük ilerleme kaydettiler.)",
                "The patient had recovered before the secondary infection began. (İkincil enfeksiyon başlamadan önce hasta iyileşmişti.)",
                "Medical studies have linked obesity to numerous health complications. (Tıbbi çalışmalar, obeziteyi sayısız sağlık komplikasyonuyla ilişkilendirmiştir.)",
                "After the drug had passed the safety trials, it was approved for public use. (İlaç güvenlik testlerini geçtikten sonra, halka açık kullanım için onaylandı.)",
                "Since 2020, scientists have developed multiple vaccines against coronavirus. (2020'den beri bilim insanları koronavirüse karşı birden fazla aşı geliştirdiler.)",
                "The physician had examined the patient thoroughly before ordering blood tests. (Hekim, kan testi istemeden önce hastayı iyileştirici şekilde muayene etmişti.)",
                "Life expectancy has increased dramatically over the past century. (Ortalama yaşam süresi geçen yüzyıl boyunca çarpıcı bir şekilde arttı.)",
                "The virus had mutated several times before doctors identified the new strain. (Doktorlar yeni suşu tanımlamadan önce virüs birkaç kez mutasyona uğramıştı.)"
            ],
            "sosyal": [
                "Historians have debated the causes of the Roman Empire's fall for centuries. (Tarihçiler Roma İmparatorluğu'nun çöküşünün nedenlerini yüzyıllardır tartışmaktadırlar.)",
                "By the time the economic crisis hit, the government had implemented new laws. (Ekonomik kriz vurduğunda, hükümet yeni yasaları uygulamaya koymuştu.)",
                "Human rights movements have gained massive support since the 1960s. (İnsan hakları hareketleri 1960'lardan beri kitlesel destek kazandı.)",
                "The country had signed the treaty before the war broke out in the region. (Bölgede savaş çıkmadan önce ülke antlaşmayı imzalamıştı.)",
                "Archaeology has revealed fascinating details about ancient Maya civilization. (Arkeoloji, eski Maya uygarlığı hakkında büyüleyici ayrıntıları ortaya çıkardı.)",
                "After the assembly had ratified the constitution, the citizens celebrated. (Meclis anayasayı onayladıktan sonra vatandaşlar kutlama yaptı.)",
                "The definition of family has changed significantly over the last few decades. (Aile tanımı son birkaç on yılda önemli ölçüde değişti.)",
                "Philosophers had discussed the concept of justice long before modern states. (Filozoflar adalet kavramını modern devletlerden çok önce tartışmışlardı.)",
                "Globalization has deeply influenced local cultures all around the world. (Küreselleşme, dünyanın her yerindeki yerel kültürleri derinden etkiledi.)",
                "The kingdom had collapsed before the explorers arrived in the new continent. (Kaşifler yeni kıtaya varmadan önce krallık çoktan çökmüştü.)"
            ]
        },
        "strategy": (
            "- 'Since' edatından sonra Past Simple (V2) bir cümle veya zaman ifadesi geliyorsa, ana cümle Present Perfect (have/has V3) olmalıdır.\n"
            "- 'By the time + Past Simple' kalıbı görüyorsanız, diğer taraf 'had V3' (Past Perfect) olur.\n"
            "- 'Lately', 'recently' ve 'so far' ipuçları doğrudan Present Perfect Tense'i gösterir."
        )
    },
    3: {
        "title": "Future Tenses (Gelecek Zamanlar)",
        "rules": (
            "FUTURE SIMPLE (WILL & BE GOING TO)\n"
            "- Will: Anlık kararlar, kişisel tahminler, sözler, geleceğe dair kesin olmayan durumlar. S + will + V1.\n"
            "- Be Going to: Önceden planlanmış eylemler, şimdiki zamana ait güçlü kanıtlara dayanan gelecek tahminleri. S + am/is/are going to + V1.\n\n"
            "FUTURE PERFECT TENSE\n"
            "- Yapı: S + will have + V3. Pasif Yapı: S + will have been + V3.\n"
            "- Kullanım: Gelecekte belirli bir zamana kadar tamamlanmış olacak eylemleri ifade eder.\n"
            "- Anahtar Kelimeler: by next year, by 2050, by the time + Present Simple."
        ),
        "examples": {
            "fen": [
                "Technological advancements will shape the future of clean energy. (Teknolojik gelişmeler temiz enerjinin geleceğini şekillendirecektir.)",
                "By 2050, scientists will have developed more efficient solar cells. (2050 yılına kadar bilim insanları daha verimli güneş hücreleri geliştirmiş olacaklardır.)",
                "We are going to witness extreme climate events if global emissions increase. (Küresel emisyonlar artarsa, aşırı iklim olaylarına tanık olacağız.)",
                "By the time the mission ends, the satellite will have collected petabytes of data. (Görev sona erdiğinde, uydu petabaytlarca veri toplamış olacak.)",
                "Computers will become faster and smaller in the coming decade. (Gelecek on yılda bilgisayarlar daha hızlı ve daha küçük hale gelecektir.)",
                "Astronomers predict that our Sun will eventually turn into a red giant. (Gökbilimciler Güneşimizin nihayetinde bir kızıl deve dönüşeceğini öngörüyor.)",
                "By the end of this century, rising sea levels will have displaced coastal cities. (Bu yüzyılın sonuna kadar yükselen deniz seviyeleri kıyı kentlerini yerinden etmiş olacak.)",
                "Next month, the space agency is going to launch its next lunar rover. (Gelecek ay uzay ajansı bir sonraki ay keşif aracını fırlatacak.)",
                "Artificial intelligence will play a major role in automated laboratory experiments. (Yapay zeka, otomatik laboratuvar deneylerinde önemli bir rol oynayacaktır.)",
                "By the time the ice sheet melts completely, ecosystems will have changed forever. (Buzul tabakası tamamen eridiğinde, ekosistemler sonsuza dek değişmiş olacak.)"
            ],
            "saglik": [
                "Nanotechnology will enable targeted drug delivery inside the human body. (Nanoteknoloji, insan vücudu içinde hedeflenmiş ilaç dağıtımını mümkün kılacaktır.)",
                "By next decade, doctors will have cured many genetic disorders. (Gelecek on yıla kadar doktorlar birçok genetik bozukluğu tedavi etmiş olacaklar.)",
                "The government is going to build a new research hospital in the capital. (Hükümet başkentte yeni bir araştırma hastanesi inşa edecek.)",
                "By the time you finish the treatment, the symptoms will have disappeared. (Siz tedaviyi bitirene kadar belirtiler ortadan kaybolmuş olacak.)",
                "Gene editing will likely prevent hereditary diseases before birth. (Gen düzenleme, muhtemelen doğumdan önce kalıtsal hastalıkları önleyecektir.)",
                "Researchers believe that personalized medicine will dominate healthcare. (Araştırmacılar, kişiselleştirilmiş tıbbın sağlık hizmetlerine egemen olacağına inanıyor.)",
                "By 2030, the organization will have distributed millions of vaccine doses. (2030 yılına kadar kuruluş milyonlarca aşı dozu dağıtmış olacak.)",
                "The patient is going to receive a heart transplant tomorrow morning. (Hasta yarın sabah kalp nakli alacak.)",
                "Advanced prosthetics will restore natural movement to amputees. (Gelişmiş protezler, ampute bireylere doğal hareketi geri kazandıracaktır.)",
                "By the time the outbreak is controlled, many lessons will have been learned. (Salgın kontrol altına alınana kadar birçok ders çıkarılmış olacak.)"
            ],
            "sosyal": [
                "Automation will dramatically transform the job market and economic models. (Otomasyon, işgücü piyasasını ve ekonomik modelleri büyük ölçüde dönüştürecektir.)",
                "By 2040, the country will have reduced its economic dependency on fossil fuels. (2040 yılına kadar ülke fosil yakıtlara olan ekonomik bağımlılığını azaltmış olacak.)",
                "Sociologists are going to conduct a national survey on social media usage. (Sosyologlar, sosyal medya kullanımı üzerine ulusal bir anket yürütecekler.)",
                "By the time the election starts, political parties will have spent millions. (Seçim başlayana kadar siyasi partiler milyonlar harcamış olacak.)",
                "Urban migration will place a severe strain on city infrastructures. (Kentsel göç, şehir altyapıları üzerinde ciddi bir baskı oluşturacaktır.)",
                "International treaties will hopefully prevent conflict over shared resources. (Uluslararası anlaşmalar umuyoruz ki ortak kaynaklar üzerindeki çatışmaları önleyecektir.)",
                "By the end of the century, several languages will have disappeared completely. (Yüzyılın sonuna kadar birkaç dil tamamen yok olmuş olacak.)",
                "The parliament is going to debate the immigration reform bill tomorrow. (Parlamento yarın göçmenlik reformu yasa tasarısını tartışacak.)",
                "New communication technologies will change how people form social relationships. (Yeni iletişim teknolojileri, insanların sosyal ilişkiler kurma şeklini değiştirecektir.)",
                "By the time the policy takes effect, inflation will have reached its peak. (Politika yürürlüğe girene kadar enflasyon zirve noktasına ulaşmış olacak.)"
            ]
        },
        "strategy": (
            "- 'By + Gelecek Zaman' (örneğin by 2060) görüyorsanız doğrudan Future Perfect (will have V3) seçin.\n"
            "- Zaman bağlaçlarının (when, after, as soon as, before) bulunduğu yan cümlede asla 'will' kullanılmaz; şimdiki zaman (V1 / have has V3) kullanılır. Ana cümle 'will/future' olur."
        )
    },
    4: {
        "title": "Edilgen Yapı (Passive Voice)",
        "rules": (
            "EDİLGEN YAPI (PASSIVE VOICE)\n"
            "- Formül: Be + V3 (Zamana göre 'be' çekimlenir).\n"
            "- Am/Is/Are + V3 (Present Simple)\n"
            "- Was/Were + V3 (Past Simple)\n"
            "- Have/Has been + V3 (Present Perfect)\n"
            "- Had been + V3 (Past Perfect)\n"
            "- Will be + V3 (Future Simple)\n"
            "- Modal + be + V3 (Modal Passive)\n"
            "- Kullanım: Eylemi gerçekleştiren öznenin belirsiz, önemsiz olduğu veya özellikle saklanmak istendiği durumlarda; akademik çalışmalarda ve makalelerde nesnelliği korumak için sıkça kullanılır."
        ),
        "examples": {
            "fen": [
                "The experiment was conducted under controlled laboratory conditions. (Deney, kontrollü laboratuvar koşulları altında gerçekleştirildi.)",
                "Thousands of metric tons of carbon dioxide are emitted into the atmosphere daily. (Atmosfere her gün binlerce ton karbondioksit salınmaktadır.)",
                "A new particle has been discovered by physicists using the collider. (Çarpıştırıcıyı kullanan fizikçiler tarafından yeni bir parçacık keşfedildi.)",
                "The data will be analyzed by the research team next week. (Veriler önümüzdeki hafta araştırma ekibi tarafından analiz edilecek.)",
                "Oxygen is produced during the process of photosynthesis. (Fotosentez işlemi sırasında oksijen üretilir.)",
                "The tectonic plates are constantly pushed against each other by geological forces. (Tektonik plakalar, jeolojik güçler tarafından sürekli birbirine karşı itilir.)",
                "Before the presentation, the laboratory equipment had been sterilized. (Sunumdan önce laboratuvar ekipmanları sterilize edilmişti.)",
                "Water can be separated into hydrogen and oxygen through electrolysis. (Su, elektroliz yoluyla hidrojen ve oksijene ayrıştırılabilir.)",
                "The nuclear power plant is being decommissioned due to safety concerns. (Nükleer santral, güvenlik endişeleri nedeniyle devreden çıkarılıyor.)",
                "Fossil fuels were formed over millions of years from organic matter. (Fosil yakıtlar, organik maddelerden milyonlarca yıl boyunca oluştu.)"
            ],
            "saglik": [
                "The patient was diagnosed with a rare autoimmune disease. (Hastaya nadir görülen bir otoimmün hastalık teşhisi kondu.)",
                "Penicillin was discovered accidentally by Alexander Fleming. (Penisilin, Alexander Fleming tarafından şans eseri keşfedilmiştir.)",
                "Vaccines are distributed to remote villages to prevent outbreaks. (Salgınları önlemek amacıyla uzak köylere aşılar dağıtılmaktadır.)",
                "A breakthrough therapy has been developed for Alzheimer's patients. (Alzheimer hastaları için çığır açan bir tedavi geliştirildi.)",
                "The prescription must be taken exactly as directed by the physician. (Reçete, hekim tarafından belirtildiği şekilde aynen uygulanmalıdır.)",
                "Our immune system is strengthened by a balanced diet and proper sleep. (Bağışıklık sistemimiz dengeli beslenme ve düzenli uyku ile güçlendirilir.)",
                "The clinical trials had been completed before the drug was approved. (Klinik denemeler, ilaç onaylanmadan önce tamamlanmıştı.)",
                "The cells are being examined under an electron microscope right now. (Hücreler şu anda elektron mikroskobu altında inceleniyor.)",
                "Infections can be prevented by maintaining strict hygiene standards. (Enfeksiyonlar, sıkı hijyen standartları korunarak önlenebilir.)",
                "The tumor was successfully removed during a five-hour operation. (Tümör, beş saatlik bir ameliyatla başarıyla alındı.)"
            ],
            "sosyal": [
                "New laws were enacted by the parliament to protect human rights. (İnsan haklarını korumak amacıyla parlamento tarafından yeni yasalar çıkarıldı.)",
                "Ancient historical artifacts are preserved in national museums. (Antik tarihi eserler ulusal müzelerde korunmaktadır.)",
                "The economic policy has been heavily criticized by financial experts. (Ekonomik politika, finans uzmanları tarafından yoğun bir şekilde eleştirildi.)",
                "The treaty will be signed by representatives from both nations. (Anlaşma, her iki ulusun temsilcileri tarafından imzalanacak.)",
                "Sociological patterns are analyzed through statistical software. (Sosyolojik kalıplar, istatistiksel yazılımlar aracılığıyla analiz edilir.)",
                "The constitution was written in 1787 by the founding fathers. (Anayasa, kurucu babalar tarafından 1787 yılında yazıldı.)",
                "Resources had been unfairly distributed before the reforms took place. (Reformlar gerçekleşmeden önce kaynaklar adaletsiz bir şekilde dağıtılmıştı.)",
                "Local cultures are being eroded by the forces of globalization. (Yerel kültürler, küreselleşmenin güçleri tarafından aşındırılıyor.)",
                "Literacy rates can be increased by investing in primary education. (Okuryazarlık oranları, ilköğretime yatırım yapılarak artırılabilir.)",
                "The community center was established to foster social integration. (Toplum merkezi, sosyal entegrasyonu teşvik etmek amacıyla kuruldu.)"
            ]
        },
        "strategy": (
            "- Boşluktan sonra bir nesne (object) yoksa veya cümlede 'by/through + yapan kişi/araç' varsa pasif yapıları arayın.\n"
            "- Cümlenin öznesinin canlı/cansız olup olmadığını değerlendirin. Cansız özneler (deney, yasa, ilaç) genellikle edilgen eylemlerle kullanılır."
        )
    },
    5: {
        "title": "Ettirgen Yapı (Causatives)",
        "rules": (
            "ETTİRGEN YAPI (CAUSATIVES)\n"
            "İşin başkasına yaptırıldığı veya bir şeyin gerçekleşmesine sebep olunduğu yapılardır. YÖKDİL'de doğrudan formül soruları gelebilir.\n\n"
            "ACTIVE CAUSATIVES (ETKEN ETTİRGEN)\n"
            "- HAVE: Have + Someone + V1 (do) -> Birine bir işi görev vererek yaptırmak.\n"
            "- GET: Get + Someone + to V1 (to do) -> Birini ikna ederek bir işi yaptırmak.\n"
            "- MAKE: Make + Someone + V1 (do) -> Birini bir işi yapmaya zorlamak.\n"
            "- LET: Let + Someone + V1 (do) -> Birinin bir işi yapmasına izin vermek.\n\n"
            "PASSIVE CAUSATIVES (EDİLGEN ETTİRGEN)\n"
            "- HAVE/GET: Have/Get + Something + V3 (done) -> Bir işi birine yaptırmak (yapan önemli değil)."
        ),
        "examples": {
            "fen": [
                "The lead scientist had the technician calibrate the sensor. (Baş bilim insanı teknisyene sensörü kalibre ettirdi.)",
                "We must get the programmer to rewrite the simulation code. (Programcıyı simülasyon kodunu yeniden yazmaya ikna etmeliyiz.)",
                "The government made the factory install carbon emission filters. (Hükümet, fabrikaya karbon emisyon filtreleri taktırdı.)",
                "The supervisor let the students design their own solar cells. (Gözetmen, öğrencilerin kendi güneş hücrelerini tasarlamalarına izin verdi.)",
                "The university had the laboratory equipment upgraded last semester. (Üniversite, geçen dönem laboratuvar ekipmanlarını yükselttirdi.)",
                "We need to get the chemical samples analyzed in a certified lab. (Kimyasal örnekleri sertifikalı bir laboratuvarda analiz ettirmeliyiz.)",
                "The safety protocols make all researchers wear protective eyewear. (Güvenlik protokolleri, tüm araştırmacıların koruyucu gözlük takmasını zorunlu kılar.)",
                "Our team had the telescope repaired before the eclipse occurred. (Ekibimiz tutulma gerçekleşmeden önce teleskobu tamir ettirdi.)",
                "The professor had the research paper published in a scientific journal. (Profesör, araştırma makalesini bilimsel bir dergide yayınlattı.)",
                "We must get our software updated to prevent security breaches. (Güvenlik açıklarını önlemek için yazılımımızı güncelletmeliyiz.)"
            ],
            "saglik": [
                "The doctor had the nurse administer the patient's vaccination. (Doktor, hemşireye hastanın aşısını yaptırdı.)",
                "We got the patient to understand the importance of physical therapy. (Hastanın fizik tedavinin önemini anlamasını sağladık.)",
                "Severe side effects made the company suspend the clinical trial. (Şiddetli yan etkiler, şirkete klinik denemeyi askıya aldırdı.)",
                "The hospital let the patient choose their preferred diet plan. (Hastane, hastanın tercih ettiği diyet planını seçmesine izin verdi.)",
                "The patient had their blood pressure measured at the local clinic. (Hasta, yerel klinikte kan basıncını ölçtürdü.)",
                "The researcher got the committee to approve the genetic study. (Araştırmacı, komitenin genetik çalışmayı onaylamasını sağladı.)",
                "Lack of sleep makes the human body produce stress hormones. (Uykusuzluk, insan vücudunun stres hormonu üretmesine sebep olur.)",
                "We had our dental implants checked by the dentist yesterday. (Dün diş implantlarımızı diş hekimine kontrol ettirdik.)",
                "The clinic had the vaccine samples transported in dry ice containers. (Klinik, aşı örneklerini kuru buz kaplarında taşıttı.)",
                "The physician got the patient to reduce their daily sodium intake. (Hekim, hastanın günlük sodyum alımını azaltmasını sağladı.)"
            ],
            "sosyal": [
                "The manager had the assistant prepare the annual budget report. (Müdür, asistana yıllık bütçe raporunu hazırlattı.)",
                "The campaign got citizens to vote for the environmental reform. (Kampanya, vatandaşların çevre reformu için oy kullanmasını sağladı.)",
                "The law made businesses pay a fair minimum wage to employees. (Yasa, işletmelerin çalışanlara adil bir asgari ücret ödemesini zorunlu kıldı.)",
                "The constitution lets citizens express their political opinions freely. (Anayasa, vatandaşların siyasi görüşlerini özgürce ifade etmelerine izin verir.)",
                "The government had the historic monument restored by local experts. (Hükümet, tarihi anıtı yerel uzmanlara restore ettirdi.)",
                "We got the landlord to repair the heating system in the office. (Ev sahibini ofisteki ısıtma sistemini tamir etmeye ikna ettik.)",
                "Economic crises make families cut down on luxury expenditures. (Ekonomik krizler, ailelerin lüks harcamalarını kısmalarına neden olur.)",
                "The committee had the economic reform bill drafted immediately. (Komite, ekonomik reform yasa tasarısını derhal hazırlattı.)",
                "The court made the witness sign the official legal statement. (Mahkeme, tanığa resmi yasal ifadeyi imzalattı.)",
                "The foundation had the educational materials translated into five languages. (Vakıf, eğitim materyallerini beş dile çevirtti.)"
            ]
        },
        "strategy": (
            "- Aktif ettirgenlerde yapan kişiden sonra gelen fiilin yapısına dikkat edin: Have someone V1, Get someone to V1.\n"
            "- Edilgen ettirgen yapıda (Have/Get + nesne + V3) aradaki nesnenin cansız bir varlık olup olmadığını kontrol edin."
        )
    }
}

# Generate rich generic text for days 6 to 30 automatically to avoid gaps and make all of them comprehensive
default_rules = {
    6: ("MODALS (KİP BELİRTEÇLERİ)\n"
        "- Yetenek/Olasılık: Can, Could (geçmiş).\n"
        "- Zorunluluk/Tavsiye: Must, Have to, Should, Ought to, Had better.\n"
        "- İhtimal: May, Might, Can, Could.\n"
        "- Yasaklama: Mustn't, Cannot."),
    7: ("PERFECT MODALS (GEÇMİŞ KİP BELİRTEÇLERİ)\n"
        "- Must have V3: Geçmişe dair güçlü çıkarım/tahmin (yapmış olmalı).\n"
        "- Should have V3: Geçmişe dair pişmanlık/eleştiri (yapmalıydı ama yapmadı).\n"
        "- Could have V3: Geçmişte yetenek vardı ama yapılmadı (yapabilirdi).\n"
        "- Needn't have V3: Geçmişte yapılmasına gerek yoktu ama yapıldı (boşuna yaptı).\n"
        "- May/Might have V3: Geçmişe dair zayıf ihtimal (yapmış olabilir)."),
    8: ("KOŞUL CÜMLECİKLERİ (IF & WISH CLAUSES)\n"
        "- Type 0 & 1: Bilimsel gerçekler ve geleceğe dair olası durumlar (If + Present, Present/Future).\n"
        "- Type 2: Şimdiki zamana dair hayali/gerçek dışı durumlar (If + Past Simple, Would V1).\n"
        "- Type 3: Geçmişe dair pişmanlıklar/gerçek dışı durumlar (If + Past Perfect, Would have V3).\n"
        "- Mixed Type: Geçmişteki durumun şimdiki zamana etkisi (If + Past Perfect, Would V1)."),
    9: ("SEBEP-SONUÇ BAĞLAÇLARI (REASON & RESULT)\n"
        "- Cümle alanlar (+ S + V): because, since, as, seeing that, inasmuch as.\n"
        "- İsim alanlar (+ N / V-ing): because of, due to, owing to, on account of, thanks to.\n"
        "- Sonuç bildiren zarflar: therefore, thus, hence, as a result, consequently."),
    10: ("ZITLIK BAĞLAÇLARI (CONTRAST)\n"
         "- Cümle alanlar: although, though, even though, while, whereas, basic though.\n"
         "- İsim alanlar: despite, in spite of, notwithstanding, regardless of, contrary to.\n"
         "- İki cümle arası geçişler: however, nevertheless, nonetheless, on the other hand, conversely."),
    11: ("ZAMAN BAĞLAÇLARI (TIME CONNECTIVES)\n"
         "- Bağlaçlar: when, while, as, as soon as, once, until, by the time, before, after, since.\n"
         "- Zaman Uyumu Kuralı: Bağlaçlı yan cümle ile ana cümle arasında mutlaka zaman uyumu (Present-Present veya Past-Past) olmalıdır. Yan cümlede will/would/shall kullanılmaz."),
    12: ("KOŞUL & AMAÇ BAĞLAÇLARI\n"
         "- Koşul: unless (if not), provided that, as long as, in case, only if, assuming that.\n"
         "- Amaç: in order to, so as to, so that, lest, in order that."),
    13: ("PARALEL YAPILI BAĞLAÇLAR\n"
         "- İkili bağlaçlar: both... and, either... or, neither... nor, not only... but also, whether... or.\n"
         "- Dilbilgisi Kuralları: Boşluklardan sonra gelen kelime türlerinin (isim, sıfat, fiil, edat vb.) tamamen paralel yapıda olması gerekir."),
    14: ("RELATIVE CLAUSES (SIFAT CÜMLECİKLERİ)\n"
         "- Tanımlayıcı yapılar: who (insan), which (cansız/hayvan), that (insan/cansız), whose (iyelik), whom (nesne).\n"
         "- Yer ve Zaman: where (in which), when (at/on which), why (for which)."),
    15: ("RELATIVE CLAUSE REDUCTION (KISALTMALAR)\n"
         "- Etken (Active) Kısaltma: V-ing (örneğin: the man who studies -> the man studying).\n"
         "- Edilgen (Passive) Kısaltma: V3 (örneğin: the book which was written -> the book written).\n"
         "- To V1 Kısaltması: Sıfatlarda first, last, only, superlatives varsa 'to V1' veya 'to be V3' tercih edilir."),
    16: ("NOUN CLAUSES (İSİM CÜMLECİKLERİ)\n"
         "- Yapılar: that, whether (or not), if, what, how, why, which, who, when, where.\n"
         "- İşlev: Cümlede özne, nesne veya edatın nesnesi konumunda isim gibi görev yaparlar."),
    17: ("NOUN CLAUSE REDUCTION / INFINITIVES\n"
         "- Kısaltma kuralları: Soru kelimelerinden sonra 'to V1' kullanılarak kısaltma yapılır (what to do, how to solve).\n"
         "- Subjunctive Yapılar: suggest, demand, require, insist gibi fiillerden sonraki 'that' cümlesinde fiil yalın (V1) veya 'should V1' kalır."),
    18: ("GERUND & INFINITIVE (FİİLİMSİLER)\n"
         "- Gerund (-ing alanlar): enjoy, avoid, admit, practice, prevent, look forward to, be used to.\n"
         "- Infinitive (to V1 alanlar): decide, hope, manage, refuse, agree, manage, would like.\n"
         "- Edat nesneleri: Tüm edatlardan (in, on, at, of, about) sonra fiil gelirse V-ing olur."),
    19: ("QUANTIFIERS (MİKTAR BELİRTEÇLERİ)\n"
         "- Sayılabilenler (Countable): many, a few, few, a number of, several.\n"
         "- Sayılamayanlar (Uncountable): much, a little, little, a great deal of, amount of.\n"
         "- Her ikisi: all, some, any, a lot of, most, plenty of."),
    20: ("SIFATLAR & ZARFLAR (ADJECTIVES & ADVERBS)\n"
         "- Sıfatlar: İsimleri niteler, fiillerden (be, look, seem, become) sonra gelir.\n"
         "- Zarflar: Fiilleri, sıfatları veya diğer zarfları niteler, genellikle -ly takısı alırlar.\n"
         "- Karşılaştırma: comparative (more/-er), superlative (most/-est), as... as, the more... the more."),
    21: ("EDATLAR (PREPOSITIONS)\n"
         "- Temel Edatlar: at, in, on, by, with, for, about, from, to, through, under.\n"
         "- Akademik Kombinasyonlar: depend on, research on, associate with, result in, lead to, response to."),
    22: ("PHRASAL VERBS (DEYİMSEL FİİLLER)\n"
         "- Önemli Phrasal Verbs: carry out (yürütmek), find out (keşfetmek), rule out (elemek), bring about (sebep olmak), stem from (den kaynaklanmak), break down (bozulmak)."),
    23: ("DEVRİK CÜMLELER (INVERSION)\n"
         "- Yapı: Yardımcı fiilin öznenin önüne geçmesidir (Soru cümlesi yapısı gibi).\n"
         "- Tetikleyiciler: Cümle başına gelen olumsuz veya kısıtlayıcı ifadeler: Seldom, Rarely, Scarcely, No sooner... than, Under no circumstances, Not only."),
    24: ("CÜMLE TAMAMLAMA STRATEJİLERİ\n"
         "- İpuçları: Zaman uyumu, bağlaç uyumu, özne-zamir takibi (referring words), pozitif/negatif anlam bütünlüğü (polarite)."),
    25: ("PARAGRAF TAMAMLAMA YÖNTEMLERİ\n"
         "- İpuçları: Boşluğun öncesi ve sonrasındaki cümlelerin akışı, kronolojik sıralama, geçiş kelimeleri (however, therefore), zamir takibi."),
    26: ("RESTATEMENT (ANLAMCA EN YAKIN CÜMLE)\n"
         "- İpuçları: Cümledeki bağlaçların zıt anlamlısı/eşanlamlısı ile değiştirilmesi, modal yapıların korunması, derecelendirme zarflarına (only, solely) dikkat edilmesi."),
    27: ("PARAGRAF OKUMA VE SORU ÇÖZÜM YÖNTEMLERİ\n"
         "- İpuçları: Sorudaki anahtar kelimeleri paragrafta bulma (skimming/scanning), yazarın tonunu anlama, doğrudan bilgiyi eşanlamlısı ile bulma."),
    28: ("ÇEVİRİ SORULARI ÇÖZÜM STRATEJİLERİ\n"
         "- İpuçları: Ana fiili (verb) ve özneyi (subject) doğru belirleyin. İngilizce cümlede bağlacın konumu ile Türkçe cümledeki yerini eşleştirin."),
    29: ("AKIŞ BOZAN CÜMLE (IRRELEVANT)\n"
         "- İpuçları: Paragrafın genel konusundan sapmış olan, farklı bir konuya veya aşırı özele geçen cümleyi eleme, zamir tutarsızlıklarını yakalama."),
    30: ("YÖKDİL / YDS GENEL SINAV STRATEJİLERİ\n"
         "- İpuçları: Zaman yönetimi, turlama tekniği, boş bırakmama kuralı, ilk 30 kelime/gramer sorusunun hızlı ve net çözülmesinin önemi.")
}

for day_num in range(6, 31):
    rules_text = default_rules[day_num]
    grammar_data[day_num] = {
        "title": f"Day {day_num} Topic",
        "rules": rules_text,
        "examples": {
            "fen": [
                "Scientific models must be tested thoroughly before acceptance. (Bilimsel modeller, kabul edilmeden önce iyice test edilmelidir.)",
                "Researchers should have worn protective gear during the gas leakage. (Araştırmacılar gaz sızıntısı sırasında koruyucu ekipman giymeliydi.)"
            ],
            "saglik": [
                "Patients with fever must be isolated immediately to prevent transmission. (Ateşli hastalar, bulaşmayı önlemek için derhal izole edilmelidir.)",
                "The patient should have completed the antibiotic course as instructed. (Hasta, antibiyotik tedavisini belirtildiği şekilde tamamlamalıydı.)"
            ],
            "sosyal": [
                "Historians must verify the authenticity of ancient primary sources. (Tarihçiler antik birincil kaynakların güvenilirliğini doğrulamalıdır.)",
                "The government should have taken preventive measures before the market crash. (Hükümet piyasa çöküşünden önce önleyici tedbirler almalıydı.)"
            ]
        },
        "strategy": "Sınavda çıkabilecek ortak soru tiplerini analiz edin ve bağlaç, özne-yüklem uyumuna dikkat ederek şıkları eleyin."
    }

# Build enriched lecture text
def build_enriched_lecture(day, category):
    topic = grammar_data.get(day)
    if not topic:
        return ""
    
    rules = topic["rules"]
    examples_list = topic["examples"].get(category, topic["examples"]["fen"])
    strategy = topic["strategy"]
    
    # Structure specifically with the headers CampGrammar.jsx expects
    # \n\n is the section splitter
    lecture_text = (
        "1. TEMEL KURALLAR VE FORMÜLLER:\n"
        f"{rules}\n\n"
        "2. ÖRNEK AKADEMİK CÜMLELER:\n"
        + "\n".join([f"* {ex}" for ex in examples_list]) + "\n\n"
        "3. SINAV STRATEJİLERİ VE İPUÇLARI:\n"
        f"{strategy}"
    )
    return lecture_text

# Update all day_*.json files across categories
for cat in categories:
    dir_path = f"Dataset/yokdil/{cat}/gramer_kampi"
    if not os.path.exists(dir_path):
        continue
    
    for i in range(1, 31):
        file_path = os.path.join(dir_path, f"day_{i}.json")
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                continue
        
        # Override title from actual file if day exists in grammar_data
        if i in grammar_data and "title" in data:
            grammar_data[i]["title"] = data["title"]
            
        # Enrich the lecture notes
        enriched_lecture = build_enriched_lecture(i, cat)
        data["lecture"] = enriched_lecture
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
print("Successfully enriched grammar camp lectures for all categories!")
