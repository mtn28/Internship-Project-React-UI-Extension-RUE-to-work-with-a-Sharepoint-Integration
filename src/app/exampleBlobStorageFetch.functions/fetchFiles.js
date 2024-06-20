  const axios = require('axios');
  const parseString = require('xml2js').parseString;
  const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

  const account = "hubspotconnectors";
  const accountKey = "77V38RN5en6KD5zgiG1wV6lCeMu0sh4sTxBtZ/Oy95GXo00DLfaUK0LhArdgE6I3ulWF6Xj9d+Hu+AStrIN5rQ==";
  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  exports.main = async (context = {}) => {
    return await fetchDataFromAzureStorage(blobServiceClient);
  };

  const fetchDataFromAzureStorage = async (blobServiceClient) => {
    const apiUrl = 'https://hubspotconnectors.blob.core.windows.net/teste-upload?restype=container&comp=list&sp=racwdli&st=2024-05-29T08:51:26Z&se=2024-06-29T16:51:26Z&spr=https&sv=2022-11-02&sr=c&sig=wUF4Mk6aFtDJ7Ha4PmfdhK1YTwjVHnCkqOBmFmK7lIw%3D';

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
        const link = `https://hubspotconnectors.blob.core.windows.net/teste-upload/${encodeURIComponent(blobName)}?sp=racwdli&st=2024-05-29T08:51:26Z&se=2024-06-29T16:51:26Z&spr=https&sv=2022-11-02&sr=c&sig=wUF4Mk6aFtDJ7Ha4PmfdhK1YTwjVHnCkqOBmFmK7lIw%3D`;
        return { blobName, link };
      });

      return downloadUrls;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  };
