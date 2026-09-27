import { nuzulRank } from "@/data/nuzul";
import { HAFS_VERSE_COUNTS } from "@/lib/verse-counts";
import type { Surah } from "@/types/quran";

type SurahSeed = Omit<Surah, "ayahCount" | "nuzulOrder">;

const SEEDS: SurahSeed[] = [
  { number: 1, slug: "fatiha", name: "Fâtiha", nameArabic: "ٱلْفَاتِحَة", transliteratedName: "Al-Fātiḥah", englishName: "Al-Faatiha", meaning: "Açılış", revelation: "meccan", about: "Kur’an’ın anahtarı. Hamd, rahmet ve hidayet duasını yedi ayette toplar." },
  { number: 2, slug: "bakara", name: "Bakara", nameArabic: "ٱلْبَقَرَة", transliteratedName: "Al-Baqarah", englishName: "Al-Baqara", meaning: "İnek", revelation: "medinan", about: "En uzun sure. İman, ibadet, hukuk ve Âyetü’l-Kürsî gibi temel metinleri barındırır." },
  { number: 3, slug: "al-i-imran", name: "Âl-i İmrân", nameArabic: "آلِ عِمْرَان", transliteratedName: "Āl ʿImrān", englishName: "Aal-i-Imraan", meaning: "İmrân ailesi", revelation: "medinan", about: "Meryem ve İsa kıssaları, Uhud dersleri ve tevhid vurgusu." },
  { number: 4, slug: "nisa", name: "Nisâ", nameArabic: "ٱلنِّسَاء", transliteratedName: "An-Nisāʾ", englishName: "An-Nisaa", meaning: "Kadınlar", revelation: "medinan", about: "Aile, miras, adalet ve toplumsal haklar." },
  { number: 5, slug: "maide", name: "Mâide", nameArabic: "ٱلْمَائِدَة", transliteratedName: "Al-Māʾidah", englishName: "Al-Maaida", meaning: "Sofra", revelation: "medinan", about: "Helal-haram, ahitleşme ve Ehl-i kitap ile ilişkiler." },
  { number: 6, slug: "enam", name: "En’âm", nameArabic: "ٱلْأَنْعَام", transliteratedName: "Al-Anʿām", englishName: "Al-Anaam", meaning: "Hayvanlar", revelation: "meccan", about: "Tevhid, peygamberlik ve şirk eleştirisinin yoğun olduğu Mekkî sure." },
  { number: 7, slug: "araf", name: "A’râf", nameArabic: "ٱلْأَعْرَاف", transliteratedName: "Al-Aʿrāf", englishName: "Al-Araaf", meaning: "Yüksek yerler", revelation: "meccan", about: "Geçmiş ümmetlerin kıssaları ve A’râf ehli." },
  { number: 8, slug: "enfal", name: "Enfâl", nameArabic: "ٱلْأَنْفَال", transliteratedName: "Al-Anfāl", englishName: "Al-Anfaal", meaning: "Ganimetler", revelation: "medinan", about: "Bedir ve savaş etiği, ganimet ve güven." },
  { number: 9, slug: "tevbe", name: "Tevbe", nameArabic: "ٱلتَّوْبَة", transliteratedName: "At-Tawbah", englishName: "At-Tawba", meaning: "Tövbe", revelation: "medinan", about: "Besmele ile başlamayan tek sure. Antlaşmalar, tevbe ve Tebük." },
  { number: 10, slug: "yunus", name: "Yûnus", nameArabic: "يُونُس", transliteratedName: "Yūnus", englishName: "Yunus", meaning: "Yunus", revelation: "meccan", about: "Vahiy, sabır ve Yunus peygamberin kavmi." },
  { number: 11, slug: "hud", name: "Hûd", nameArabic: "هُود", transliteratedName: "Hūd", englishName: "Hud", meaning: "Hûd", revelation: "meccan", about: "Nuh, Hûd, Sâlih, İbrahim, Şuayb ve Musa kıssaları." },
  { number: 12, slug: "yusuf", name: "Yûsuf", nameArabic: "يُوسُف", transliteratedName: "Yūsuf", englishName: "Yusuf", meaning: "Yûsuf", revelation: "meccan", about: "Yûsuf kıssasının baştan sona anlatıldığı sure." },
  { number: 13, slug: "rad", name: "Ra’d", nameArabic: "ٱلرَّعْد", transliteratedName: "Ar-Raʿd", englishName: "Ar-Rad", meaning: "Gök gürültüsü", revelation: "medinan", about: "Vahyin hakikati, kalplerin mutmain olması ve gök gürültüsü." },
  { number: 14, slug: "ibrahim", name: "İbrâhîm", nameArabic: "إِبْرَاهِيم", transliteratedName: "Ibrāhīm", englishName: "Ibrahim", meaning: "İbrahim", revelation: "meccan", about: "İbrahim’in duası, nimet ve nankörlük." },
  { number: 15, slug: "hicr", name: "Hicr", nameArabic: "ٱلْحِجْر", transliteratedName: "Al-Ḥijr", englishName: "Al-Hijr", meaning: "Hicr", revelation: "meccan", about: "Kur’an’ın korunması ve Hicr kavmi." },
  { number: 16, slug: "nahl", name: "Nahl", nameArabic: "ٱلنَّحْل", transliteratedName: "An-Naḥl", englishName: "An-Nahl", meaning: "Arı", revelation: "meccan", about: "Nimetler, arı ve adalet." },
  { number: 17, slug: "isra", name: "İsrâ", nameArabic: "ٱلْإِسْرَاء", transliteratedName: "Al-Isrāʾ", englishName: "Al-Israa", meaning: "Gece yürüyüşü", revelation: "meccan", about: "İsra, ahlaki emirler ve İsrail oğulları." },
  { number: 18, slug: "kehf", name: "Kehf", nameArabic: "ٱلْكَهْف", transliteratedName: "Al-Kahf", englishName: "Al-Kahf", meaning: "Mağara", revelation: "meccan", about: "Ashâb-ı Kehf, Musa-Hızır ve Zülkarneyn kıssaları." },
  { number: 19, slug: "meryem", name: "Meryem", nameArabic: "مَرْيَم", transliteratedName: "Maryam", englishName: "Maryam", meaning: "Meryem", revelation: "meccan", about: "Zekeriya, Yahya, Meryem ve İsa." },
  { number: 20, slug: "taha", name: "Tâhâ", nameArabic: "طه", transliteratedName: "Ṭā-Hā", englishName: "Taa-Haa", meaning: "Tâhâ", revelation: "meccan", about: "Musa kıssası ve vahyin tesellisi." },
  { number: 21, slug: "enbiya", name: "Enbiyâ", nameArabic: "ٱلْأَنْبِيَاء", transliteratedName: "Al-Anbiyāʾ", englishName: "Al-Anbiyaa", meaning: "Peygamberler", revelation: "meccan", about: "Peygamberlerin ortak tevhid mesajı." },
  { number: 22, slug: "hac", name: "Hac", nameArabic: "ٱلْحَجّ", transliteratedName: "Al-Ḥajj", englishName: "Al-Hajj", meaning: "Hac", revelation: "medinan", about: "Hac, kurban ve iki secde ayeti." },
  { number: 23, slug: "muminun", name: "Mü’minûn", nameArabic: "ٱلْمُؤْمِنُون", transliteratedName: "Al-Muʾminūn", englishName: "Al-Muminoon", meaning: "Müminler", revelation: "meccan", about: "Müminlerin vasıfları ve yaratılış." },
  { number: 24, slug: "nur", name: "Nûr", nameArabic: "ٱلنُّور", transliteratedName: "An-Nūr", englishName: "An-Noor", meaning: "Nur", revelation: "medinan", about: "Mahremiyet, iffet ve ‘Allah göklerin ve yerin nurudur’ ayeti." },
  { number: 25, slug: "furkan", name: "Furkân", nameArabic: "ٱلْفُرْقَان", transliteratedName: "Al-Furqān", englishName: "Al-Furqaan", meaning: "Ayıran", revelation: "meccan", about: "Hak ile batılı ayıran vahiy ve Rahman’ın kulları." },
  { number: 26, slug: "suara", name: "Şuarâ", nameArabic: "ٱلشُّعَرَاء", transliteratedName: "Ash-Shuʿarāʾ", englishName: "Ash-Shuaraa", meaning: "Şairler", revelation: "meccan", about: "Musa, İbrahim ve diğer peygamber kıssaları." },
  { number: 27, slug: "neml", name: "Neml", nameArabic: "ٱلنَّمْل", transliteratedName: "An-Naml", englishName: "An-Naml", meaning: "Karınca", revelation: "meccan", about: "Süleyman, Sebe ve karınca kıssası." },
  { number: 28, slug: "kasas", name: "Kasas", nameArabic: "ٱلْقَصَص", transliteratedName: "Al-Qaṣaṣ", englishName: "Al-Qasas", meaning: "Kıssalar", revelation: "meccan", about: "Musa’nın doğumu, Medyen ve Karun." },
  { number: 29, slug: "ankebut", name: "Ankebût", nameArabic: "ٱلْعَنْكَبُوت", transliteratedName: "Al-ʿAnkabūt", englishName: "Al-Ankaboot", meaning: "Örümcek", revelation: "meccan", about: "İmtihan, sabır ve örümcek evi benzetmesi." },
  { number: 30, slug: "rum", name: "Rûm", nameArabic: "ٱلرُّوم", transliteratedName: "Ar-Rūm", englishName: "Ar-Room", meaning: "Rumlar", revelation: "meccan", about: "Rumların galibiyeti ve yaratılış ayetleri." },
  { number: 31, slug: "lokman", name: "Lokmân", nameArabic: "لُقْمَان", transliteratedName: "Luqmān", englishName: "Luqman", meaning: "Lokman", revelation: "meccan", about: "Lokman’ın oğluna öğütleri." },
  { number: 32, slug: "secde", name: "Secde", nameArabic: "ٱلسَّجْدَة", transliteratedName: "As-Sajdah", englishName: "As-Sajda", meaning: "Secde", revelation: "meccan", about: "Yaratılış, vahiy ve vacip secde ayeti." },
  { number: 33, slug: "ahzab", name: "Ahzâb", nameArabic: "ٱلْأَحْزَاب", transliteratedName: "Al-Aḥzāb", englishName: "Al-Ahzaab", meaning: "Gruplar", revelation: "medinan", about: "Hendek savaşı, peygamber ailesi ve toplum adabı." },
  { number: 34, slug: "sebe", name: "Sebe’", nameArabic: "سَبَأ", transliteratedName: "Sabaʾ", englishName: "Saba", meaning: "Sebe", revelation: "meccan", about: "Davud, Süleyman ve Sebe halkı." },
  { number: 35, slug: "fatir", name: "Fâtır", nameArabic: "فَاطِر", transliteratedName: "Fāṭir", englishName: "Faatir", meaning: "Yaratan", revelation: "meccan", about: "Yaratılış, melekler ve nimet." },
  { number: 36, slug: "yasin", name: "Yâsîn", nameArabic: "يس", transliteratedName: "Yā-Sīn", englishName: "Yaseen", meaning: "Yâsîn", revelation: "meccan", about: "Kalbi sure olarak anılır; diriliş ve tevhid." },
  { number: 37, slug: "saffat", name: "Sâffât", nameArabic: "ٱلصَّافَّات", transliteratedName: "Aṣ-Ṣāffāt", englishName: "As-Saaffaat", meaning: "Sıra sıra duranlar", revelation: "meccan", about: "Melekler, İbrahim ve İsmail kıssası." },
  { number: 38, slug: "sad", name: "Sâd", nameArabic: "ص", transliteratedName: "Ṣād", englishName: "Saad", meaning: "Sâd", revelation: "meccan", about: "Davud, Süleyman ve Eyyûb." },
  { number: 39, slug: "zumer", name: "Zümer", nameArabic: "ٱلزُّمَر", transliteratedName: "Az-Zumar", englishName: "Az-Zumar", meaning: "Gruplar", revelation: "meccan", about: "İhlas, tövbe ve ahiret sahneleri." },
  { number: 40, slug: "mumin", name: "Mü’min", nameArabic: "غَافِر", transliteratedName: "Ghāfir", englishName: "Ghafir", meaning: "Bağışlayan", revelation: "meccan", about: "Firavun’un iman eden yakını ve bağışlanma." },
  { number: 41, slug: "fussilet", name: "Fussilet", nameArabic: "فُصِّلَت", transliteratedName: "Fuṣṣilat", englishName: "Fussilat", meaning: "Ayrıntılı kılınan", revelation: "meccan", about: "Kur’an’ın açıklanması ve secde ayeti." },
  { number: 42, slug: "sura", name: "Şûrâ", nameArabic: "ٱلشُّورَىٰ", transliteratedName: "Ash-Shūrā", englishName: "Ash-Shura", meaning: "Danışma", revelation: "meccan", about: "Vahiy, şura ve adalet." },
  { number: 43, slug: "zuhruf", name: "Zuhruf", nameArabic: "ٱلزُّخْرُف", transliteratedName: "Az-Zukhruf", englishName: "Az-Zukhruf", meaning: "Süs", revelation: "meccan", about: "Dünya süsü, İbrahim ve İsa." },
  { number: 44, slug: "duhan", name: "Duhân", nameArabic: "ٱلدُّخَان", transliteratedName: "Ad-Dukhān", englishName: "Ad-Dukhaan", meaning: "Duman", revelation: "meccan", about: "Uyarı, duman ve kurtuluş." },
  { number: 45, slug: "casiye", name: "Câsiye", nameArabic: "ٱلْجَاثِيَة", transliteratedName: "Al-Jāthiyah", englishName: "Al-Jaathiya", meaning: "Diz çöken", revelation: "meccan", about: "Ayetler, heva ve hesap günü." },
  { number: 46, slug: "ahkaf", name: "Ahkâf", nameArabic: "ٱلْأَحْقَاف", transliteratedName: "Al-Aḥqāf", englishName: "Al-Ahqaf", meaning: "Kumlu tepeler", revelation: "meccan", about: "Âd kavmi ve anne-babaya iyilik." },
  { number: 47, slug: "muhammed", name: "Muhammed", nameArabic: "مُحَمَّد", transliteratedName: "Muḥammad", englishName: "Muhammad", meaning: "Muhammed", revelation: "medinan", about: "İman, cihad ve münafıklık." },
  { number: 48, slug: "fetih", name: "Fetih", nameArabic: "ٱلْفَتْح", transliteratedName: "Al-Fatḥ", englishName: "Al-Fath", meaning: "Fetih", revelation: "medinan", about: "Hudeybiye ve apaçık fetih." },
  { number: 49, slug: "hucurat", name: "Hucurât", nameArabic: "ٱلْحُجُرَات", transliteratedName: "Al-Ḥujurāt", englishName: "Al-Hujuraat", meaning: "Odalar", revelation: "medinan", about: "Ahlak, gıybet ve kardeşlik." },
  { number: 50, slug: "kaf", name: "Kâf", nameArabic: "ق", transliteratedName: "Qāf", englishName: "Qaaf", meaning: "Kâf", revelation: "meccan", about: "Diriliş, kalp ve şahitlik." },
  { number: 51, slug: "zariyat", name: "Zâriyât", nameArabic: "ٱلذَّارِيَات", transliteratedName: "Adh-Dhāriyāt", englishName: "Adh-Dhaariyat", meaning: "Savuranlar", revelation: "meccan", about: "Rızık, İbrahim’in misafirleri ve yaratılış gayesi." },
  { number: 52, slug: "tur", name: "Tûr", nameArabic: "ٱلطُّور", transliteratedName: "Aṭ-Ṭūr", englishName: "At-Tur", meaning: "Dağ", revelation: "meccan", about: "Yeminler, ahiret ve uyarı." },
  { number: 53, slug: "necm", name: "Necm", nameArabic: "ٱلنَّجْم", transliteratedName: "An-Najm", englishName: "An-Najm", meaning: "Yıldız", revelation: "meccan", about: "Vahiy tecrübesi ve vacip secde." },
  { number: 54, slug: "kamer", name: "Kamer", nameArabic: "ٱلْقَمَر", transliteratedName: "Al-Qamar", englishName: "Al-Qamar", meaning: "Ay", revelation: "meccan", about: "Ayın yarılması ve geçmiş kavimler." },
  { number: 55, slug: "rahman", name: "Rahmân", nameArabic: "ٱلرَّحْمَٰن", transliteratedName: "Ar-Raḥmān", englishName: "Ar-Rahmaan", meaning: "Rahman", revelation: "medinan", about: "Nimetler ve ‘O hâlde Rabbinizin hangi nimetlerini yalanlıyorsunuz?’ nakaratı." },
  { number: 56, slug: "vakia", name: "Vâkıa", nameArabic: "ٱلْوَاقِعَة", transliteratedName: "Al-Wāqiʿah", englishName: "Al-Waaqia", meaning: "Gerçekleşen", revelation: "meccan", about: "Kıyamet ve üç sınıf insan." },
  { number: 57, slug: "hadid", name: "Hadîd", nameArabic: "ٱلْحَدِيد", transliteratedName: "Al-Ḥadīd", englishName: "Al-Hadid", meaning: "Demir", revelation: "medinan", about: "İman, infak ve demirin indirilişi." },
  { number: 58, slug: "mucadele", name: "Mücâdele", nameArabic: "ٱلْمُجَادَلَة", transliteratedName: "Al-Mujādilah", englishName: "Al-Mujaadila", meaning: "Tartışan kadın", revelation: "medinan", about: "Zıhar, gizlilik ve edep." },
  { number: 59, slug: "hasr", name: "Haşr", nameArabic: "ٱلْحَشْر", transliteratedName: "Al-Ḥashr", englishName: "Al-Hashr", meaning: "Toplanma", revelation: "medinan", about: "Nefis muhasebesi ve esmâ-i hüsnâ." },
  { number: 60, slug: "mumtehine", name: "Mümtehine", nameArabic: "ٱلْمُمْتَحَنَة", transliteratedName: "Al-Mumtaḥanah", englishName: "Al-Mumtahana", meaning: "Sınanan kadın", revelation: "medinan", about: "Dostluk, imtihan ve adalet." },
  { number: 61, slug: "saff", name: "Saff", nameArabic: "ٱلصَّفّ", transliteratedName: "Aṣ-Ṣaff", englishName: "As-Saff", meaning: "Sıra", revelation: "medinan", about: "Söz ile eylemin örtüşmesi." },
  { number: 62, slug: "cuma", name: "Cuma", nameArabic: "ٱلْجُمُعَة", transliteratedName: "Al-Jumuʿah", englishName: "Al-Jumua", meaning: "Cuma", revelation: "medinan", about: "Cuma namazı ve zikir." },
  { number: 63, slug: "munafikun", name: "Münâfikûn", nameArabic: "ٱلْمُنَافِقُون", transliteratedName: "Al-Munāfiqūn", englishName: "Al-Munaafiqoon", meaning: "Münafıklar", revelation: "medinan", about: "Münafıklığın alametleri." },
  { number: 64, slug: "tegabun", name: "Tegâbün", nameArabic: "ٱلتَّغَابُن", transliteratedName: "At-Taghābun", englishName: "At-Taghaabun", meaning: "Aldanma", revelation: "medinan", about: "Dünya-ahiret aldanması ve tevekkül." },
  { number: 65, slug: "talak", name: "Talâk", nameArabic: "ٱلطَّلَاق", transliteratedName: "Aṭ-Ṭalāq", englishName: "At-Talaaq", meaning: "Boşanma", revelation: "medinan", about: "Boşanma hukuku ve takva." },
  { number: 66, slug: "tahrim", name: "Tahrîm", nameArabic: "ٱلتَّحْرِيم", transliteratedName: "At-Taḥrīm", englishName: "At-Tahrim", meaning: "Haram kılma", revelation: "medinan", about: "Peygamber ailesi ve tövbe." },
  { number: 67, slug: "mulk", name: "Mülk", nameArabic: "ٱلْمُلْك", transliteratedName: "Al-Mulk", englishName: "Al-Mulk", meaning: "Egemenlik", revelation: "meccan", about: "Mülk Allah’ındır; göklerin yaratılışı ve korunma." },
  { number: 68, slug: "kalem", name: "Kalem", nameArabic: "ٱلْقَلَم", transliteratedName: "Al-Qalam", englishName: "Al-Qalam", meaning: "Kalem", revelation: "meccan", about: "Kalem üzerine yemin, ahlak ve bahçe sahipleri." },
  { number: 69, slug: "hakka", name: "Hâkka", nameArabic: "ٱلْحَاقَّة", transliteratedName: "Al-Ḥāqqah", englishName: "Al-Haaqqa", meaning: "Gerçekleşecek olan", revelation: "meccan", about: "Kıyametin kesinliği." },
  { number: 70, slug: "mearic", name: "Meâric", nameArabic: "ٱلْمَعَارِج", transliteratedName: "Al-Maʿārij", englishName: "Al-Maarij", meaning: "Yükseliş merdivenleri", revelation: "meccan", about: "Ahiret ve insan tabiatı." },
  { number: 71, slug: "nuh", name: "Nûh", nameArabic: "نُوح", transliteratedName: "Nūḥ", englishName: "Nooh", meaning: "Nuh", revelation: "meccan", about: "Nuh’un daveti ve duası." },
  { number: 72, slug: "cin", name: "Cin", nameArabic: "ٱلْجِنّ", transliteratedName: "Al-Jinn", englishName: "Al-Jinn", meaning: "Cin", revelation: "meccan", about: "Cinlerin Kur’an’ı dinlemesi." },
  { number: 73, slug: "muzzemmil", name: "Müzzemmil", nameArabic: "ٱلْمُزَّمِّل", transliteratedName: "Al-Muzzammil", englishName: "Al-Muzzammil", meaning: "Örtünen", revelation: "meccan", about: "Gece ibadeti ve ağır söz." },
  { number: 74, slug: "muddessir", name: "Müddessir", nameArabic: "ٱلْمُدَّثِّر", transliteratedName: "Al-Muddaththir", englishName: "Al-Muddaththir", meaning: "Bürünen", revelation: "meccan", about: "Uyarıcılık ve kıyamet sahneleri." },
  { number: 75, slug: "kiyame", name: "Kıyâme", nameArabic: "ٱلْقِيَامَة", transliteratedName: "Al-Qiyāmah", englishName: "Al-Qiyaama", meaning: "Kıyamet", revelation: "meccan", about: "Diriliş ve insanın kendi aleyhine şahitliği." },
  { number: 76, slug: "insan", name: "İnsan", nameArabic: "ٱلْإِنْسَان", transliteratedName: "Al-Insān", englishName: "Al-Insaan", meaning: "İnsan", revelation: "medinan", about: "İnsanın yaratılışı ve iyilerin ödülü." },
  { number: 77, slug: "murselat", name: "Mürselât", nameArabic: "ٱلْمُرْسَلَات", transliteratedName: "Al-Mursalāt", englishName: "Al-Mursalaat", meaning: "Gönderilenler", revelation: "meccan", about: "Uyarı ve ‘yalanlayanların vay hâline’ nakaratı." },
  { number: 78, slug: "nebe", name: "Nebe", nameArabic: "ٱلنَّبَأ", transliteratedName: "An-Nabaʾ", englishName: "An-Naba", meaning: "Haber", revelation: "meccan", about: "Büyük haber: diriliş." },
  { number: 79, slug: "naziat", name: "Nâziât", nameArabic: "ٱلنَّازِعَات", transliteratedName: "An-Nāziʿāt", englishName: "An-Naaziaat", meaning: "Söküp alanlar", revelation: "meccan", about: "Kıyamet ve Musa-Firavun." },
  { number: 80, slug: "abese", name: "Abese", nameArabic: "عَبَسَ", transliteratedName: "ʿAbasa", englishName: "Abasa", meaning: "Yüzünü ekşitti", revelation: "meccan", about: "Âmâ sahabi kıssası ve vahyin evrenselliği." },
  { number: 81, slug: "tekvir", name: "Tekvîr", nameArabic: "ٱلتَّكْوِير", transliteratedName: "At-Takwīr", englishName: "At-Takwir", meaning: "Dürüp bürüme", revelation: "meccan", about: "Kıyamet tasviri." },
  { number: 82, slug: "infitar", name: "İnfitâr", nameArabic: "ٱلْإِنْفِطَار", transliteratedName: "Al-Infiṭār", englishName: "Al-Infitaar", meaning: "Yarılma", revelation: "meccan", about: "Göğün yarılması ve amel defteri." },
  { number: 83, slug: "mutaffifin", name: "Mutaffifîn", nameArabic: "ٱلْمُطَفِّفِين", transliteratedName: "Al-Muṭaffifīn", englishName: "Al-Mutaffifin", meaning: "Ölçüde hile yapanlar", revelation: "meccan", about: "Ticari hile ve Siccîn-İlliyyîn." },
  { number: 84, slug: "insikak", name: "İnşikâk", nameArabic: "ٱلْإِنْشِقَاق", transliteratedName: "Al-Inshiqāq", englishName: "Al-Inshiqaaq", meaning: "Yarılma", revelation: "meccan", about: "Kitabın sağdan veya arkadan verilmesi." },
  { number: 85, slug: "buruc", name: "Bürûc", nameArabic: "ٱلْبُرُوج", transliteratedName: "Al-Burūj", englishName: "Al-Burooj", meaning: "Burçlar", revelation: "meccan", about: "Ashâb-ı Uhdûd ve sabır." },
  { number: 86, slug: "tarik", name: "Târık", nameArabic: "ٱلطَّارِق", transliteratedName: "Aṭ-Ṭāriq", englishName: "At-Taariq", meaning: "Gece gelen", revelation: "meccan", about: "Yıldız ve insanın yaratılışı." },
  { number: 87, slug: "ala", name: "A’lâ", nameArabic: "ٱلْأَعْلَىٰ", transliteratedName: "Al-Aʿlā", englishName: "Al-Alaa", meaning: "En yüce", revelation: "meccan", about: "Tesbih, kolaylaştırma ve ahiret." },
  { number: 88, slug: "gasiye", name: "Gâşiye", nameArabic: "ٱلْغَاشِيَة", transliteratedName: "Al-Ghāshiyah", englishName: "Al-Ghaashiya", meaning: "Bürüyecek olan", revelation: "meccan", about: "Ahiret sahneleri ve devenin yaratılışı." },
  { number: 89, slug: "fecr", name: "Fecr", nameArabic: "ٱلْفَجْر", transliteratedName: "Al-Fajr", englishName: "Al-Fajr", meaning: "Tan yerinin ağarması", revelation: "meccan", about: "Fecr, on gece ve nefs-i mutmainne." },
  { number: 90, slug: "beled", name: "Beled", nameArabic: "ٱلْبَلَد", transliteratedName: "Al-Balad", englishName: "Al-Balad", meaning: "Belde", revelation: "meccan", about: "Mekke ve sarp yokuş: köle azadı, yoksulu doyurma." },
  { number: 91, slug: "sems", name: "Şems", nameArabic: "ٱلشَّمْس", transliteratedName: "Ash-Shams", englishName: "Ash-Shams", meaning: "Güneş", revelation: "meccan", about: "Güneş, nefis ve Semûd." },
  { number: 92, slug: "leyl", name: "Leyl", nameArabic: "ٱللَّيْل", transliteratedName: "Al-Layl", englishName: "Al-Lail", meaning: "Gece", revelation: "meccan", about: "Gece-gündüz ve cömertlik." },
  { number: 93, slug: "duha", name: "Duhâ", nameArabic: "ٱلضُّحَىٰ", transliteratedName: "Aḍ-Ḍuḥā", englishName: "Ad-Dhuhaa", meaning: "Kuşluk", revelation: "meccan", about: "Vahyin kesilmediği müjdesi ve yetime sahip çıkma." },
  { number: 94, slug: "insirah", name: "İnşirah", nameArabic: "ٱلشَّرْح", transliteratedName: "Ash-Sharḥ", englishName: "Ash-Sharh", meaning: "Açılma", revelation: "meccan", about: "Göğsün açılması ve ‘her güçlükle birlikte bir kolaylık vardır’." },
  { number: 95, slug: "tin", name: "Tîn", nameArabic: "ٱلتِّين", transliteratedName: "At-Tīn", englishName: "At-Tin", meaning: "İncir", revelation: "meccan", about: "İncir, zeytin ve insanın ahsen-i takvîm üzere yaratılışı." },
  { number: 96, slug: "alak", name: "Alak", nameArabic: "ٱلْعَلَق", transliteratedName: "Al-ʿAlaq", englishName: "Al-Alaq", meaning: "Kan pıhtısı", revelation: "meccan", about: "İlk inen ayetler: oku. İlmin ve yaratılışın başlangıcı." },
  { number: 97, slug: "kadir", name: "Kadir", nameArabic: "ٱلْقَدْر", transliteratedName: "Al-Qadr", englishName: "Al-Qadr", meaning: "Kadir", revelation: "meccan", about: "Kadir gecesi bin aydan hayırlıdır." },
  { number: 98, slug: "beyyine", name: "Beyyine", nameArabic: "ٱلْبَيِّنَة", transliteratedName: "Al-Bayyinah", englishName: "Al-Bayyina", meaning: "Apaçık delil", revelation: "medinan", about: "Kitap ehli ve tertemiz sayfalar." },
  { number: 99, slug: "zilzal", name: "Zilzâl", nameArabic: "ٱلزَّلْزَلَة", transliteratedName: "Az-Zalzalah", englishName: "Az-Zalzala", meaning: "Sarsıntı", revelation: "medinan", about: "Yerin sarsılması ve zerre kadar hayır-şer." },
  { number: 100, slug: "adiyat", name: "Âdiyât", nameArabic: "ٱلْعَادِيَات", transliteratedName: "Al-ʿĀdiyāt", englishName: "Al-Aadiyaat", meaning: "Süratle koşanlar", revelation: "meccan", about: "Atlar üzerine yemin ve insanın nankörlüğü." },
  { number: 101, slug: "karia", name: "Kâria", nameArabic: "ٱلْقَارِعَة", transliteratedName: "Al-Qāriʿah", englishName: "Al-Qaaria", meaning: "Kapı çalan", revelation: "meccan", about: "Kıyamet ve amellerin tartılması." },
  { number: 102, slug: "tekasur", name: "Tekâsür", nameArabic: "ٱلتَّكَاثُر", transliteratedName: "At-Takāthur", englishName: "At-Takaathur", meaning: "Çokluk yarışı", revelation: "meccan", about: "Dünya yarışı kabre kadar sürer." },
  { number: 103, slug: "asr", name: "Asr", nameArabic: "ٱلْعَصْر", transliteratedName: "Al-ʿAṣr", englishName: "Al-Asr", meaning: "Asır", revelation: "meccan", about: "Zaman üzerine yemin: iman, salih amel, hak ve sabır." },
  { number: 104, slug: "humeze", name: "Hümeze", nameArabic: "ٱلْهُمَزَة", transliteratedName: "Al-Humazah", englishName: "Al-Humaza", meaning: "Çekiştiren", revelation: "meccan", about: "Gıybet, mal yığma ve Hutame." },
  { number: 105, slug: "fil", name: "Fîl", nameArabic: "ٱلْفِيل", transliteratedName: "Al-Fīl", englishName: "Al-Fil", meaning: "Fil", revelation: "meccan", about: "Fil ordusunun helaki." },
  { number: 106, slug: "kureys", name: "Kureyş", nameArabic: "قُرَيْش", transliteratedName: "Quraysh", englishName: "Quraish", meaning: "Kureyş", revelation: "meccan", about: "Kureyş’in güvenliği ve rızkı." },
  { number: 107, slug: "maun", name: "Mâûn", nameArabic: "ٱلْمَاعُون", transliteratedName: "Al-Māʿūn", englishName: "Al-Maaun", meaning: "Zekât / küçük yardım", revelation: "meccan", about: "Yetimi itmek, namazı savsaklamak ve yardımı esirgemek." },
  { number: 108, slug: "kevser", name: "Kevser", nameArabic: "ٱلْكَوْثَر", transliteratedName: "Al-Kawthar", englishName: "Al-Kawthar", meaning: "Bolluk", revelation: "meccan", about: "En kısa sure. Kevser nimeti ve namaz." },
  { number: 109, slug: "kafirun", name: "Kâfirûn", nameArabic: "ٱلْكَافِرُون", transliteratedName: "Al-Kāfirūn", englishName: "Al-Kaafiroon", meaning: "Kâfirler", revelation: "meccan", about: "İbadette net ayrım: sizin dininiz size, benim dinim bana." },
  { number: 110, slug: "nasr", name: "Nasr", nameArabic: "ٱلنَّصْر", transliteratedName: "An-Naṣr", englishName: "An-Nasr", meaning: "Yardım", revelation: "medinan", about: "Fetih ve tesbih ile tövbe. Son inen surelerden." },
  { number: 111, slug: "tebbet", name: "Tebbet", nameArabic: "ٱلْمَسَد", transliteratedName: "Al-Masad", englishName: "Al-Masad", meaning: "Hurma lifi", revelation: "meccan", about: "Ebû Leheb ve eşi." },
  { number: 112, slug: "ihlas", name: "İhlâs", nameArabic: "ٱلْإِخْلَاص", transliteratedName: "Al-Ikhlāṣ", englishName: "Al-Ikhlaas", meaning: "Samimiyet", revelation: "meccan", about: "Tevhidin özü: De ki, O Allah birdir." },
  { number: 113, slug: "felak", name: "Felak", nameArabic: "ٱلْفَلَق", transliteratedName: "Al-Falaq", englishName: "Al-Falaq", meaning: "Sabah aydınlığı", revelation: "meccan", about: "Kötülüklerden Allah’a sığınma." },
  { number: 114, slug: "nas", name: "Nâs", nameArabic: "ٱلنَّاس", transliteratedName: "An-Nās", englishName: "An-Naas", meaning: "İnsanlar", revelation: "meccan", about: "Vesveseden Allah’a sığınma. Mushaf’ın sonu." },
];

export const SURAHS: Surah[] = SEEDS.map((seed) => ({
  ...seed,
  ayahCount: HAFS_VERSE_COUNTS[seed.number],
  nuzulOrder: nuzulRank(seed.number, "egyptian"),
}));

const byNumber = new Map(SURAHS.map((surah) => [surah.number, surah]));
const bySlug = new Map(SURAHS.map((surah) => [surah.slug, surah]));

export function getSurah(number: number): Surah | undefined {
  return byNumber.get(number);
}

export function getSurahBySlug(slug: string): Surah | undefined {
  const numeric = Number(slug);
  if (Number.isInteger(numeric)) return getSurah(numeric);
  return bySlug.get(slug.toLocaleLowerCase("tr-TR"));
}

export function getSurahsInMushafOrder(): Surah[] {
  return SURAHS;
}

export function getSurahsInNuzulOrder(
  source: "egyptian" | "noldeke" = "egyptian",
): Surah[] {
  return [...SURAHS].sort(
    (a, b) => nuzulRank(a.number, source) - nuzulRank(b.number, source),
  );
}

export function adjacentSurahs(
  number: number,
  order: "mushaf" | "nuzul" = "mushaf",
  nuzulSource: "egyptian" | "noldeke" = "egyptian",
): { previous?: Surah; next?: Surah } {
  const list =
    order === "nuzul" ? getSurahsInNuzulOrder(nuzulSource) : SURAHS;
  const index = list.findIndex((item) => item.number === number);
  if (index === -1) return {};
  return { previous: list[index - 1], next: list[index + 1] };
}
