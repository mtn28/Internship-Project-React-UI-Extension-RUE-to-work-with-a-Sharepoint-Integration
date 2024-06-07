const axios = require("axios");

exports.main = async (context = {}) => {
    const url = 'https://sharepoint-integration-with-hubspot.onrender.com/hubspot/list-docs';
    const headers = {
        'Content-Type': 'application/json'
    };

    const { email, hubspotObjectType, hubspotObjectId } = context.parameters;

    if (!email) {
        return {
            statusCode: 404,
            body: { message: 'Email is missing...' }
        };
    }

    if (!hubspotObjectType) {
        return {
            statusCode: 404,
            body: { message: 'ObjectType is missing...' }
        };
    }

    if (!hubspotObjectId) {
        return {
            statusCode: 404,
            body: { message: 'ObjectId is missing...' }
        };
    }

    try {
        const response = await axios.get(
            `${url}?email=${email}&hubspotObjectType=${hubspotObjectType}&hubspotObjectId=${hubspotObjectId}`, 
            { headers }
        );

        const files = response.data.data;

        // Notify success
        return {
            statusCode: 200,
            body: {
                message: 'Doc Tree successfully fetched!',
                data: files
            }
        };
    } catch (error) {
        console.error('Error fetching docTree:', error);
        if (error.response && error.response.status == 401){
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
