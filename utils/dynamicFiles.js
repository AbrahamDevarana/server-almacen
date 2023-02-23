
const { s3Client } = require('./s3Client')
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const tinify = require('tinify');
const fs = require('fs');

tinify.key = process.env.TINY_IMG_API_KEY;

const uploadDynamicFiles = async (files, folderName) => {


    let galeriaSet  = []

    return new Promise( async (resolve, reject) => {
            
            await Promise.all(files.map(async (item) => {
                
            const contentType = item.type
            let file = ''
            let folder = `${folderName}/files`


            if ( contentType === 'image/jpeg' || contentType === 'image/png' || contentType === 'image/jpg' ) {
                let source = tinify.fromFile(item.path);
                file = await source.toBuffer();
                folder = `${folderName}/images`
            }else{
                file = fs.readFileSync(item.path)
            }
            


            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: file,
                Key: `${folder}/file-${ new Date().getTime() }`,
                ACL: 'public-read',
                ContentType: contentType,
            }

            console.log(uploadParams);

            const data = await s3Client.send(new PutObjectCommand(uploadParams))
            if(data) {
                galeriaSet.push({url: uploadParams.Key, type: contentType})
            }else{
                reject('error')
            }

        })).catch( (err) => {
            console.log(err);
            reject(err)
        })


        resolve(galeriaSet);
    })
}


const deleteDynamicFiles = async (files) => {

    console.log(files);
    
    return new Promise( async (resolve, reject) => {
        await Promise.all(files.map(async (item) => {
            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: item
            }
            const data = await s3Client.send(new DeleteObjectCommand(deleteParams))
            if(data) {
                console.log('deleted');
            }else{
                reject('error')
            }
        })).catch( (err) => {
            console.log(err);
            reject(err)
        })
        resolve({ code: 200, msg: 'deleted' });
    })
}


module.exports = {
    uploadDynamicFiles,
    deleteDynamicFiles
}