import { Storage } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
    private readonly storage: Storage
    private readonly bucketName: string
    private readonly logger = new Logger(FileUploadService.name)

    constructor(private configService: ConfigService) {
        this.storage = new Storage({
            keyFilename: this.configService.get<string>('GCS_KEYFILE_PATH')
        })
        const bucketNameFromConfig = this.configService.get<string>('GCS_BUCKET_NAME')
        if (!bucketNameFromConfig) {
            throw new Error('GCS_BUCKET_NAME environment variable is not set!')
        }
        this.bucketName = bucketNameFromConfig
    }

    async uplaodFile(file: Express.Multer.File, addWatermark: boolean): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName)
        const uniqueFileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '_')}`
        const blob = bucket.file(uniqueFileName)

        try {
            let imageBuffer = file.buffer

            if (addWatermark) {
                const image = sharp(file.buffer)
                const metadata = await image.metadata()
                const { width, height } = metadata

                if (!width || !height) {
                    throw new Error('Resim boyutları alınamadı.')
                }

                const watermarkText = "DERYA EMLAK WHO ESTATE"

                const fontSize = Math.floor(Math.sqrt(width * width + height * height) / 15)
                const angle = Math.atan2(height, width) * 180 / Math.PI

                const svgWatermark = `
            <svg width="${width}" height="${height}">
              <style>
                .title { 
                  fill: rgba(255, 255, 255, 0.2); 
                  font-size: ${fontSize / 2}px; 
                  font-family: Arial, sans-serif;
                  font-weight: bold;
                }
              </style>
              <text 
                x="50%" 
                y="50%" 
                dominant-baseline="middle" 
                text-anchor="middle" 
                transform="rotate(-${angle} ${width / 2} ${height / 2})" 
                class="title">
                ${watermarkText}
              </text>
            </svg>
            `

                const watermarkBuffer = Buffer.from(svgWatermark)

                imageBuffer = await image.composite([{ input: watermarkBuffer, tile: false,}]).toBuffer()
            }

            return new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream({ resumable: false })
                blobStream.on('error', (err) => reject(err))
                blobStream.on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`
                    this.logger.log(`Dosya başarı ile yüklendi: ${publicUrl}`)
                    resolve(publicUrl)
                })
                blobStream.end(imageBuffer)
            })
        } catch (error) {
            this.logger.error('Resim işlenirken veya filigran eklenirken hata oluştu', error.stack)
            throw new InternalServerErrorException(`Resim işlenemedi: ${error.message}`)
        }


    }
}
