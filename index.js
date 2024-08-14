import express from 'express';
import {
    S3Client,
    ListObjectsCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
const BUCKET_REGION = process.env.BUCKET_REGION ?? 'us-east-1';
const s3Client = new S3Client({ region: BUCKET_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME ?? "non-existent-bucket-gd52q";

const app = express();
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const input = {
        Bucket: BUCKET_NAME,
        MaxKeys: 10,
    };
    const command = new ListObjectsCommand(input);
    s3Client.send(command).then(response => {
        res.status(response['$metadata'].httpStatusCode);
        res.json(response);
    }).catch(err => {
        console.log(err);
        res.status(err['$metadata']?.httpStatusCode ?? 400);
        res.json(err);
    });
});
app.get('/put', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const fileNameQueryParam = "name";
    let fileName = req.query[fileNameQueryParam]?.trim() ?? "";

    const fileContentQueryParam = "content";
    const fileContent = req.query[fileContentQueryParam] ?? "";

    const fileContentTypeQueryParam = "type";
    const fileContentType = req.query[fileContentTypeQueryParam] ?? "text/csv";

    const fileRandomizedNameQueryParam = "random";
    const fileRandomizedName = (req.query[fileRandomizedNameQueryParam] === 'true') ? true: (fileName.trim() === '' ? true: false);

    if (fileRandomizedName){
        fileName = "file_"+Math.floor(100000000000 + Math.random() * 900000000000);
    };

    const customFields = {
        fileName: {queryStringParam: fileNameQueryParam, value: fileName, desc: `Provide query string param '${fileNameQueryParam}' with any string value to overwrite.`},
        fileNameRandomized: {queryStringParam: fileRandomizedNameQueryParam, value: fileRandomizedName, desc: `Provide query string param '${fileRandomizedNameQueryParam}' with 'true' or 'false' to overwrite. Overwrites '${fileNameQueryParam}'. Defaults to 'true' if '${fileNameQueryParam}' is empty.`},
        fileContent: {queryStringParam: fileContentQueryParam, value: fileContent, desc: `Provide query string param '${fileContentQueryParam}' with any string value to overwrite.`},
        fileContentType: {queryStringParam: fileContentTypeQueryParam, value: fileContentType, desc: `Provide query string param '${fileContentTypeQueryParam}' with any valid AWS S3 Content Type to overwrite.`},
    };

    const input = {
        Body: fileContent,
        Bucket: BUCKET_NAME,
        Key: fileName,
        ContentType: fileContentType
    };
    const command = new PutObjectCommand(input);
    s3Client.send(command).then(response => {
        res.status(response['$metadata'].httpStatusCode);
        response.customFields = customFields;
        res.json(response);
    }).catch(err => {
        res.status((err['$metadata']?.httpStatusCode ?? 400));
        err.customFields = customFields;
        res.json(err);
    });
});
const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`Server is listening on port: ${port}, looking for bucket ${BUCKET_NAME} in ${BUCKET_REGION}.`));