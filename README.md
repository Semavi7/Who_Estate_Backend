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

## Çekirdek Modüllerin Detaylı Analizi

Bu bölümde, projenin ana modülleri ve bu modüllerin içerdiği CRUD dışı, özel iş mantıkları detaylandırılmıştır.

- **`AuthModule`**: Standart kimlik doğrulamanın ötesinde, gelişmiş güvenlik ve kullanıcı kurtarma mekanizmaları sunar.
  - **Endpoint'ler**:
    - `POST /auth/login`: Kullanıcı girişi yapar. Response body'de kullanıcı bilgilerini dönerken, JWT'yi güvenlik amacıyla `HttpOnly` ve `Secure` bir cookie (`accessToken`) olarak setler.
    - `POST /auth/forgot-password`: Kullanıcının e-posta adresine şifre sıfırlama linki gönderir. Güvenli, tek kullanımlık bir token oluşturur, hash'leyerek veritabanına kaydeder ve kullanıcıya e-posta ile gönderir.
    - `POST /auth/reset-password`: Gelen token'ı veritabanındaki hash ile karşılaştırır, geçerliliğini ve süresini kontrol eder, ardından kullanıcının şifresini günceller.

- **`UserModule`**: Temel kullanıcı yönetiminin yanı sıra, sisteme hazırlık ve kullanıcı etkileşimi özelliklerini içerir.
  - **Servis Mantığı**:
    - `onModuleInit`: Uygulama başladığında, veritabanında bir admin kullanıcısı olup olmadığını kontrol eder. Eğer yoksa, varsayılan bilgilerle bir admin kullanıcısı oluşturarak sistemin ilk kurulumunu kolaylaştırır.
  - **Endpoint'ler**:
    - `PATCH /user/:id/upload-image`: Kullanıcının profil resmini yüklemesini sağlar. Gelen dosyayı `FileUploadService` aracılığıyla bulut depolama alanına yükler ve URL'i kullanıcı entity'sine kaydeder.
    - `PATCH /user/:id/password`: Mevcut kullanıcının şifresini değiştirmesi için özel bir endpoint sunar. Güvenlik için eski şifrenin doğruluğunu kontrol eder.

- **`PropertiesModule`**: Projenin en karmaşık ve zengin işlevselliğe sahip modülüdür.
  - **Servis Mantığı**:
    - `onModuleInit`: MongoDB üzerinde `location.geo` alanı için bir `2dsphere` indeksi oluşturur. Bu, verimli coğrafi sorgular yapılabilmesini sağlar.
    - `create` ve `update`: `multipart/form-data` olarak gelen verileri işler. Birden fazla resim dosyasını eş zamanlı olarak (`Promise.all`) buluta yükler. `location` ve `selectedFeatures` gibi JSON formatındaki DTO alanlarını parse eder.
  - **Endpoint'ler**:
    - `GET /properties/query`: Gelen query parametrelerine göre dinamik ve karmaşık filtreleme yapar. Fiyat/alan aralığı (`minPrice`, `maxNet`), konum (`city`, `district`) ve diğer ilan özelliklerine göre arama imkanı sunar.
    - `GET /properties/near`: Belirtilen enlem ve boylama, belirli bir mesafe (metre cinsinden) içindeki ilanları coğrafi olarak sorgular (`$nearSphere`).
    - `GET /properties/lastsix`: Ana sayfada gösterilmek üzere en son eklenen 6 ilanı getirir.
    - `GET /properties/yearlistings`: MongoDB Aggregation Pipeline kullanarak mevcut yıldaki ilanların aylara göre dağılımını hesaplar ve istatistiksel veri sunar.
    - `GET /properties/piechart`: Yine Aggregation kullanarak, ilanların alt tiplerine (Daire, Villa vb.) göre yüzdelik dağılımını hesaplar ve dashboard için veri sağlar.
    - `PATCH /properties/:id`: (Admin-Only) Bir ilanın sahibini (userId) değiştirme imkanı sunar.

- **`MessagesModule`**: Standart mesajlaşma işlevlerine ek olarak durum yönetimi içerir.
  - **Endpoint'ler**:
    - `PATCH /messages/:id`: Bir mesajın `isread` durumunu `true` olarak günceller, yani "okundu" olarak işaretler.

- **`ClientIntakeModule`**: Müşteri taleplerini yönetmek için standart CRUD operasyonları sunar.

- **`FileUploadModule`**: Diğer modüllere servis sağlayan, dosyaları (özellikle resimleri) Google Cloud Storage'a yüklemekten ve URL'lerini döndürmekten sorumlu modüldür.

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
