import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    // console.log(waitedFiles);

    //GCP Storage에 파일 업로드하기

    // const storage = new Storage({
    //   projectId: '프로젝트이름',
    //   keyFilename: '키파일이름',
    // })
    //   .bucket('버킷명')
    //   .file('파일명');
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: 'gcp-file-storage.secret.json',
    }).bucket('2023-nestjs-storage');

    //[Promise, Promise, Promise..]
    const results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream() //파일을 읽음
            .pipe(storage.file(el.filename).createWriteStream()) //읽은 후 스토리지에 저장
            .on('finish', () => resolve(`폴더명/${el.filename}`))
            .on('error', () => reject());
        });
      }),
    );

    //https://storage.googleapis.com/2023-nestjs-storage/facebook.png

    return results;
  }
}
