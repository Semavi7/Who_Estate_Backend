import { Storage } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
    private readonly storage: Storage
    private readonly bucketName: string
    private readonly logger = new Logger(FileUploadService.name)

    constructor(private configService: ConfigService){
        this.storage = new Storage({
            keyFilename: this.configService.get<string>('GCS_KEYFILE_PATH')
        })
        const bucketNameFromConfig = this.configService.get<string>('GCS_BUCKET_NAME')
        if(!bucketNameFromConfig){
            throw new Error('GCS_BUCKET_NAME environment variable is not set!')
        }
        this.bucketName = bucketNameFromConfig
    }

    async uplaodFile(file: Express.Multer.File): Promise<string>{
        const bucket = this.storage.bucket(this.bucketName)
        const uniqueFileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '_')}`
        const blob = bucket.file(uniqueFileName)

        return new Promise((resolve, reject)=>{
            const blobStream = blob.createWriteStream({ resumable:false })
            blobStream.on('error', (err)=>reject(err))
            blobStream.on('finish', ()=>{
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`
                this.logger.log(`Dosya başarı ile yüklendi: ${publicUrl}`)
                resolve(publicUrl)
            })
            blobStream.end(file.buffer)
        })
    }
}
