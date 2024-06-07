const axios = require("axios");

exports.main = async (context = {}) => {
    const url = 'https://sharepoint-integration-with-hubspot.onrender.com/hubspot/download';
    const headers = {
        'Content-Type': 'application/json'
    };

    const { itemId, email } = context.parameters;

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

        // Log the entire response object to understand its structure
        console.log('Full response:', response);

        // Access the data field correctly from the response
        const { data } = response;
        
        // Log the data to check if it's being accessed correctly
        console.log('Data received:', data);

        // Ensure downloadUrl is present in the data object
        const downloadUrl = data.downloadUrl;

        if (!downloadUrl || downloadUrl === 'undefined') {
            throw new Error('Download URL is undefined or missing');
        }

        const decodeDownloadUrl = decodeURIComponent(downloadUrl);

        return {
            statusCode: 200,
            body: {
                message: 'Download url successfully fetched!',
                data: decodeDownloadUrl
            }
        };
    } catch (error) {
        console.error(`Error fetching downloadUrl for itemId: ${itemId}`, error.message);
        return {
            statusCode: 500,
            body: { message: `Error fetching downloadUrl: ${error.message}` }
        };
    }
};
