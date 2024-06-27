const axios = require("axios");

exports.main = async (context = {}) => {
    const url = 'https://sharepoint-integration-with-hubspot.onrender.com/hubspot/list-docs';
    const headers = {
        'Content-Type': 'application/json'
    };

    const email = 'michael.nunes@findmore.eu';
    const hubspotObjectType = 'Contacts';
    const hubspotObjectId = 144183980;

    let requestUrl = `${url}?email=${email}&hubspotObjectType=${hubspotObjectType}&hubspotObjectId=${hubspotObjectId}`;

    try {
        const response = await axios.get(requestUrl, { headers });

        const files = response.data.data;

        return {
            statusCode: 200,
            body: {
                message: 'Doc Tree successfully fetched!',
                data: files
            }
        };
    } catch (error) {
        console.error('Error fetching docTree:', error);
        if (error.response && error.response.status === 401) {
            return {
                statusCode: 401,
                body: { message: 'AccessToken is invalid or expired' }
            };
        } else {
            return {
                statusCode: 500,
                body: { message: `Error fetching docTree: ${error.message}` }
            };
        }
    }
};
