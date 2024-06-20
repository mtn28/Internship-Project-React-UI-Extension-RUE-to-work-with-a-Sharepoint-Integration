require('dotenv').config();
const axios = require('axios');
const parseString = require('xml2js').parseString;
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const account = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

exports.main = async (context = {}) => {
  return await fetchDataFromAzureStorage(blobServiceClient);
};

const fetchDataFromAzureStorage = async (blobServiceClient) => {
  const apiUrl = process.env.AZURE_API_URL;

  try {
    const response = await axios.get(apiUrl);
    const xmlData = response.data;

    let jsData;
    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        throw err;
      }
      jsData = result;
    });

    const blobs = jsData.EnumerationResults.Blobs.Blob;

    const downloadUrls = blobs.map((blob) => {
      const blobName = blob.Name;
      const link = `https://${account}.blob.core.windows.net/teste-upload/${encodeURIComponent(blobName)}?sp=racwdli&st=2024-05-29T08:51:26Z&se=2024-06-29T16:51:26Z&spr=https&sv=2022-11-02&sr=c&sig=wUF4Mk6aFtDJ7Ha4PmfdhK1YTwjVHnCkqOBmFmK7lIw%3D`;
      return { blobName, link };
    });

    return downloadUrls;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
