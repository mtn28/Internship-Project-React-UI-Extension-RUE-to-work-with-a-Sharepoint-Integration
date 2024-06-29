const axios = require("axios");

exports.main = async (context = {}) => {
    const url = 'https://sharepoint-integration-with-hubspot.onrender.com/hubspot/download';
    const headers = {
        'Content-Type': 'application/json'
    };

    const { itemId } = context.parameters;
    const email = 'michael.nunes@findmore.eu';

    if (!email) {
        return {
            statusCode: 404,
            body: { message: 'Email is missing...' }
        };
    }

    if (!itemId) {
        console.log('ItemId is missing...');
        return {
            statusCode: 404,
            body: { message: 'ItemId is missing...' }
        };
    }

    try {
        const response = await axios.get(
            `${url}?email=${email}&itemId=${itemId}`,
            { headers }
        );

        console.log('Full response:', response);

        const { data } = response;
        console.log('Data received:', data);

        const downloadUrl = data.downloadUrl;
        console.log("Download URL:", downloadUrl);

        if (!downloadUrl || downloadUrl === 'undefined') {
            throw new Error('Download URL is undefined or missing');
        }

        const decodedDownloadUrl = decodeURIComponent(downloadUrl);
        console.log("Decoded Download URL:", decodedDownloadUrl);

        return {
            statusCode: 200,
            body: {
                message: 'Download URL successfully fetched!',
                data: decodedDownloadUrl
            }
        };
    } catch (error) {
        console.error(`Error fetching download URL for itemId: ${itemId}`, error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        return {
            statusCode: 500,
            body: { message: `Error fetching download URL: ${error.message}` }
        };
    }
};
