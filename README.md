# WhoEstate Backend

Bu proje, WhoEstate emlak platformunun backend servisidir. Ölçeklenebilir ve bakımı kolay bir yapı sunan **NestJS** framework'ü ile geliştirilmiştir. Proje, modüler bir mimari üzerine kurulmuş olup, kullanıcı yönetimi, emlak listeleme, mesajlaşma gibi temel emlak platformu işlevlerini içerir.

## Teknoloji Yığını

- **Framework**: [NestJS](https://nestjs.com/)
- **Veritabanı**: [MongoDB](https://www.mongodb.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Kimlik Doğrulama**: [Passport.js](http://www.passportjs.org/) ile JWT (JSON Web Tokens) Stratejisi
- **API Dokümantasyonu**: [Swagger (OpenAPI)](https://swagger.io/)
- **Dosya Yükleme**: Google Cloud Storage
- **E-posta Bildirimleri**: [Nodemailer](https://nodemailer.com/)
- **Dil**: TypeScript

## Proje Mimarisi

Proje, NestJS'in modüler tasarım desenini temel alır. Her bir işlevsel alan, kendi içerisinde bağımsız çalışabilen bir **Modül** olarak tasarlanmıştır. Bu modüller, genellikle aşağıdaki katmanları içerir:

- **Controllers**: Gelen HTTP isteklerini karşılar, istek doğrulamasını başlatır ve ilgili servislere yönlendirir. API'nin dış dünyaya açılan kapısıdır.
- **Services**: İş mantığını içerir. Veritabanı işlemleri, harici API çağrıları ve diğer karmaşık operasyonlar bu katmanda gerçekleştirilir.
- **Entities**: TypeORM kullanılarak veritabanı şemalarını (MongoDB collection'ları) temsil eden sınıflardır.
- **DTOs (Data Transfer Objects)**: API istek ve yanıt gövdelerinin yapısını ve doğrulama kurallarını tanımlar. `class-validator` ve `class-transformer` kütüphaneleri ile kullanılır.
- **Guards**: Kimlik doğrulama (`JwtAuthGuard`) ve yetkilendirme (`RolesGuard`) gibi güvenlik katmanlarını uygular. Gelen isteklerin işlenip işlenemeyeceğine karar verir.

## Çekirdek Modüllerin Açıklaması

- **`AuthModule`**: Kullanıcı kimlik doğrulama ve yetkilendirme işlemlerinden sorumludur.
  - `local` stratejisi ile kullanıcı girişi.
  - `jwt` stratejisi ile API isteklerinin korunması.
  - Rol tabanlı yetkilendirme için `RolesGuard`.
  - Şifre sıfırlama token yönetimi.
  - **Güvenlik**: Başarılı giriş sonrası JWT, response body yerine `HttpOnly` bir cookie olarak setlenir. Bu, tarayıcı tabanlı XSS saldırılarına karşı koruma sağlar.

- **`UserModule`**: Kullanıcı verilerinin yönetimi (CRUD işlemleri) için gerekli altyapıyı sağlar.

- **`PropertiesModule`**: Projenin ana modülüdür. Emlak ilanlarının oluşturulması, güncellenmesi, silinmesi ve filtrelenerek listelenmesi gibi işlemleri yönetir.

- **`FileUploadModule`**: Özellikle emlak ilanlarına ait görsellerin Google Cloud Storage'a yüklenmesi ve yönetilmesinden sorumludur.

- **`MessagesModule`**: Kullanıcılar arasında veya kullanıcı ile sistem arasında gerçekleşen mesajlaşma altyapısını yönetir.

- **`ClientIntakeModule`**: Potansiyel müşteri taleplerinin (örneğin, "beni ara" formları) sisteme kaydedilmesi ve yönetilmesini sağlar.

- **`TrackViewModule`**: Emlak ilanlarının görüntülenme sayılarını takip eder.

- **`FeatureOptionsModule`**: Emlak ilanları için "oda sayısı", "ısıtma tipi" gibi dinamik ve yönetilebilir özellik seçeneklerini barındırır.

## Veritabanı Yapısı

Uygulama, esnek ve doküman tabanlı bir yapı sunan MongoDB veritabanını kullanır. Ana koleksiyonlar (Entity'ler) şunlardır:

- **`User`**: Kullanıcı bilgilerini, rollerini ve şifre hash'lerini saklar.
- **`Property`**: Emlak ilanlarının tüm detaylarını (başlık, açıklama, fiyat, konum, özellikler, resimler vb.) içerir.
- **`Message`**: Gönderici, alıcı ve mesaj içeriği gibi bilgileri barındırır.
- **`ResetToken`**: Şifre sıfırlama talepleri için oluşturulan geçici token'ları saklar.
- **`ClientIntake`**: Müşteri taleplerini ve iletişim bilgilerini içerir.
- **`FeatureOption`**: Yönetim panelinden eklenebilen dinamik ilan özelliklerini tanımlar.

## Yapılandırma (Environment Variables)

Uygulamanın düzgün çalışabilmesi için proje kök dizininde bir `.env` dosyası oluşturulmalı ve aşağıdaki ortam değişkenleri tanımlanmalıdır:

```env
# Veritabanı Bağlantısı
MONGO_URL=mongodb://user:password@host:port/database

# Uygulama Portu
PORT=3001

# JWT Güvenlik Ayarları
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRATION_TIME=3600s

# E-posta Servisi (Nodemailer)
MAIL_HOST=smtp.example.com
MAIL_USER=user@example.com
MAIL_PASS=your_password
MAIL_FROM="No Reply" <noreply@example.com>

# CORS için İstemci Adresi
CLIENT_URL=http://localhost:3000
```

## API Dokümantasyonu

Uygulama çalışırken, tüm API endpoint'leri ve DTO şemaları Swagger UI üzerinden otomatik olarak belgelenir. Geliştirme ortamında aşağıdaki adresten dokümantasyona erişebilirsiniz:

[http://localhost:3001/api](http://localhost:3001/api)

## Yayınlama (Deployment)

Bu proje, Google Cloud Platform (GCP) üzerinde sunucusuz (serverless) bir mimari ile yayınlanmıştır. Yayınlama süreci aşağıdaki adımları içerir:

1.  **Dockerize Etme:** Proje, bir `Dockerfile` kullanılarak bir Docker imajı haline getirilir.
2.  **Google Artifact Registry'e Yükleme:** Oluşturulan Docker imajı, Google Artifact Registry'e push edilir.
3.  **Google Cloud Run Servisi:** Google Cloud Run, Artifact Registry'deki imajı kullanarak uygulamayı çalıştırır ve gelen isteklere göre otomatik olarak ölçeklenir.
4.  **Subdomain Bağlama:** Cloud Run servisine özel bir subdomain bağlanarak uygulamanın internet üzerinden erişilebilir olması sağlanır.
