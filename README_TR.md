# Hipcall Node.js SDK (`@hipcall/sdk`)

> **Dil / Language:** [English (`README.md`)](./README.md) | **Türkçe**

[Hipcall](https://www.hipcall.com.tr) REST API v3 için TypeScript ve Node.js ile geliştirilmiş resmi SDK kütüphanesi.

> Tarayıcı üzerinden WebRTC ve SIP ile sesli telefon görüşmesi yapmak için [**Hipcall WebRTC SDK (`@hipcall/webrtc-sdk`)**](https://github.com/hipcall/node_webrtc_sdk) deposuna göz atın.

## Kurulum

```bash
npm install @hipcall/sdk
# veya
yarn add @hipcall/sdk
# veya
pnpm add @hipcall/sdk
```

## Hızlı Başlangıç

`HipcallClient` (veya `Client`) sınıfını içe aktarın ve Hipcall API anahtarınızla başlatın:

```ts
import { HipcallClient } from '@hipcall/sdk';

const client = new HipcallClient({
  apiKey: process.env.HIPCALL_API_TOKEN!,
  // 'tr' = https://use.hipcall.com.tr, 'global' (varsayılan) = https://use.hipcall.com
  region: 'tr',
});

// Son çağrıları listele
const calls = await client.getCalls(10, 0);
console.log(calls.data);

// Click-to-Call giden arama başlat (Call & Bridge)
const bridge = await client.callAndBridge(
  4200,
  '+905300000000',
  true,
  true,
  'Destek Ekibi'
);
console.log('Çağrı UUID:', bridge.data.id);

// Yeni görev (Task) oluştur
const task = await client.createTask({
  name: 'Müşteri geri dönüşü',
  description: 'Fatura detayı için tekrar aranacak',
  priority: 'high',
});
console.log('Oluşturulan görev ID:', task.data.id);
```

### Bölgeler

| `region` | Adres |
| :--- | :--- |
| `'global'` (varsayılan) | `https://use.hipcall.com` |
| `'tr'` | `https://use.hipcall.com.tr` |

Varsayılan bölge `global` olduğu için Türkiye hesaplarında `region: 'tr'` verin. `baseUrl` verirseniz `region` yerine o adres kullanılır.

İstemci üzerinde hem `camelCase` (`client.getCalls()`) hem de `snake_case` (`client.get_calls()`) metot isimlendirmeleri desteklenir.

## Hata Yönetimi

SDK, API'den dönen HTTP hata durumlarını özel hata sınıflarına dönüştürür:

```ts
import {
  HipcallClient,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
  HipcallAPIException,
} from '@hipcall/sdk';

const client = new HipcallClient(process.env.HIPCALL_API_TOKEN!);

try {
  const user = await client.getUser(999999);
} catch (err) {
  if (err instanceof NotFoundException) {
    console.error('Kullanıcı bulunamadı:', err.message);
  } else if (err instanceof UnauthorizedException) {
    console.error('Geçersiz API anahtarı');
  } else if (err instanceof UnprocessableEntityException) {
    console.error('Doğrulama hataları:', err.errors);
  } else if (err instanceof BadRequestException) {
    console.error('Hatalı istek:', err.detail);
  } else if (err instanceof HipcallAPIException) {
    console.error(`API hatası (${err.statusCode}):`, err.content);
  }
}
```

## Desteklenen Modüller

- [x] Görevler (`getTasks`, `createTask`, `getTask`, `updateTask`, yorumlar ve etiketler)
- [x] Telefon sistemi - çağrılar (`getCalls`, `getCall`, `callAndBridge`, `createCallCard`, `getCallCards`, yorumlar, etiketler ve çağrı sonuçları)
- [x] Telefon sistemi - dahililer (`getExtensions`, `getExtension`, `callExtension`)
- [x] Telefon sistemi - karşılama anonsları (`getGreetings`, `getGreeting`)
- [x] Telefon sistemi - numaralar (`getNumbers`, `getNumber`)
- [x] Telefon sistemi - takımlar (`getTeams`, `getTeam`)
- [x] Telefon sistemi - kullanıcılar (`getUsers`, `getUser`, `updateUser`, `getUserTodayStats`)
- [x] Telefon sistemi - sesli mesajlar (`getVoicemails`, `getVoicemail`)
- [x] Çağrı merkezi & Rehber (`getContacts`, `createContact`, `getCompanies`, `createCompany`, `lookupByPhone`, `lookupByEmail`, izinler ve özel alanlar)
- [x] Gelen kutusu (`getInboxes`, `getConversations`, `sendTextMessage`, `sendTemplateMessage`)
- [x] Satış / Fırsatlar (`getDeals`, `getDeal`, `getDealComments`, `createDealComment`)
- [x] Hesap & Profil (`getProfile`, `getProfileTodayStats`, `createSipToken`, mobil cihazlar ve bildirim anahtarları)

## Geliştirme ve Test

```bash
# Bağımlılıkları yükle
npm install

# TypeScript derlemesi
npm run build

# Testleri çalıştır
npm test
```

## Dokümantasyon ve Kaynaklar

- [Hipcall Geliştirici Portalı](https://developers.hipcall.com.tr/) — Resmi rehberler, API referansları ve entegrasyon dokümantasyonu.
- [Hipcall](https://www.hipcall.com.tr) — Bulut santral, çağrı merkezi ve CRM platformu.

## Lisans

[MIT](./LICENSE)

---

Developed by [Hipcall](https://www.hipcall.com.tr) • [Hipcall Geliştirici Portalı](https://developers.hipcall.com.tr/)
