# İKRA

Kur’an okumak, anlamak, araştırmak ve nüzul sırasını takip etmek için modern, çevrimdışı öncelikli bir kişisel okuma uygulaması.

1. Arapça metin
2. Türkçe okunuş
3. Türkçe meal
4. Tefsir

Her katman bağımsız açılıp kapanır. Aynı metin **mushaf sırası** veya **nüzul sırası** ile okunabilir.

## Özellikler

- Sure, ayet, cüz, hizb ve mushaf sayfası dolaşımı
- Arapça + Türkçe okunuş + meal + tefsir katmanları
- Klasik / detaylı / sadece Arapça görünümleri
- Diyanet, Elmalılı ve Diyanet Vakfı mealleri (kaynak API)
- Muhtasar Kur’an Tefsiri ve İbn Kesir Tefsiri (Türkçe), Celâleyn ve el-Müyesser tefsirleri (Arapça)
- Mısır/Tanzil ve Nöldeke nüzul sıraları
- Ayet URL’leri, paylaşım, kopyalama, not, favori, yer imi
- Kaldığı yerden devam, günün ayeti, okuma planları
- Arapça / okunuş / meal / tefsir tam metin araması
- Sesli okuma (internet gerekir), ayet senkronu
- PWA, IndexedDB, çevrimdışı paket indirme
- Dark / OLED / sistem teması, font ve satır ayarları

Giriş zorunlu değildir. İleride Google / Apple / e-posta ve bulut senkronu için `sync` kuyruğu veri modelinde hazırdır.

## Kurulum

```bash
npm install
npm run data:fetch   # public/data doluysa atlanır
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

## Production

```bash
npm run build
npm start
```

## Komutlar

| Komut                      | Açıklama                       |
| -------------------------- | ------------------------------ |
| `npm run dev`              | Geliştirme sunucusu            |
| `npm run build`            | Production derlemesi           |
| `npm start`                | Production sunucusu            |
| `npm run lint`             | ESLint                         |
| `npm test`                 | Birim ve veri testleri         |
| `npm run validate:quran`   | 114 sure / 6236 ayet bütünlüğü |
| `npm run data:fetch`       | Açık veri paketlerini indir    |
| `npm run data:fetch:force` | Paketleri yeniden indir        |

## Environment

`.env.example` dosyasına bakın.

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Kanonik URL, Open Graph ve sitemap bu değeri kullanır.

## Mimari

```
src/
  app/            App Router sayfaları ve metadata
  components/     Kabuk, PWA, temel UI
  features/       Okuma, arama, ses, çevrimdışı, ayarlar
  services/       Quran, meal, tefsir, ses, arama, IndexedDB
  data/           Sure meta, nüzul, kaynak adaptörleri
  lib/            Ayet sayıları, ayarlar, yardımcıları
  types/          Varlık modeli
public/data/      İndirilmiş JSON paketleri
scripts/          Veri indirme ve doğrulama
```

Okuma ekranı sunucuda sure verisini yükler; katman tercihleri, notlar ve ses istemcide tutulur. Uzun sureler artımlı olarak basılır.

## Veri kaynakları ve lisanslar

Uygulama **sahte Kur’an metni üretmez**. Arapça metin Tanzil Uthmânî hattıdır.

| Paket           | Kaynak                                            | Lisans / koşul                                                |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `quran-uthmani` | Tanzil via [AlQuran Cloud](https://alquran.cloud) | [Tanzil Public License](https://tanzil.net/docs/license)      |
| Türkçe okunuş   | Muhammet Abay, `tr.transliteration`               | Kaynak API aktarımı; yeniden dağıtım koşullarını kontrol edin |
| Diyanet meali   | `tr.diyanet`                                      | Telif Diyanet İşleri Başkanlığı’na aittir                     |
| Elmalılı meali  | `tr.yazir`                                        | Müellif / varis hakları geçerli olabilir                      |
| Diyanet Vakfı   | `tr.vakfi`                                        | Telif Türkiye Diyanet Vakfı’na aittir                         |
| Celâleyn        | `ar.jalalayn`                                     | Klasik eser; dijital aktarım AlQuran Cloud                    |
| el-Müyesser     | `ar.muyassar`                                     | King Fahd Complex                                             |
| Ses             | islamic.network CDN                               | İnternet gerekir, çevrimdışı paketlenmez                      |
| Nüzul (Mısır)   | Tanzil metadata                                   | Kronolojik tablo                                              |
| Nüzul (Nöldeke) | Nöldeke, _Geschichte des Qorāns_                  | Akademik rekonstrüksiyon                                      |

Meal ve tefsirler ticari dağıtım için ayrıca izin gerektirebilir. İKRA bunları derleme zamanında gömmek yerine `public/data` altına indirir ve lisans notunu paket JSON’unda saklar.

Türkçe tefsir için lisanslı bir kaynak bağlamak üzere `src/data/sources` adaptör katmanı kullanılır.

## PWA ve çevrimdışı

- Manifest: ad **İKRA**, `display: standalone`
- Service worker: `public/sw.js`
- Metin paketleri Cache Storage + IndexedDB
- Ses çevrimdışı zorunlu değildir
- İlk kullanımda `/cevrimdisi` üzerinden paket seçilir

## Deployment

Node 20+ yeterlidir. `NEXT_PUBLIC_SITE_URL` üretim alan adına ayarlanmalıdır.

Vercel, Docker veya herhangi bir Node host çalışır. `output: "standalone"` ihtiyaç halinde `next.config.ts` içine eklenebilir.

## Katkı

1. Veri doğruluğunu `npm run validate:quran` ile kontrol edin.
2. Arapça metni elle “düzeltmeyin”; Tanzil kaynağını güncelleyin.
3. Telifli meal/tefsiri izinsiz eklemeyin.
4. UI, okumayı gölgelememelidir: **Aç → sureyi seç → oku.**
