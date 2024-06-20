const axios = require('axios');

module.exports = async (context, req) => {
    const { email, parentFolderId } = req.query;
    const files = req.body.files;

    // Upload files to SharePoint
    const uploadFileToSharePoint = async (file) => {
        const url = `https://sharepoint-integration-with-hubspot.onrender.com/hubspot/upload?email=${email}&parentFolderId=${parentFolderId}`;
        const response = await axios.post(url, file, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    };

    try {
        const uploadPromises = files.map(file => uploadFileToSharePoint(file));
        const uploadResults = await Promise.all(uploadPromises);

        context.res = {
            status: 200,
            body: {
                message: 'Files uploaded successfully',
                results: uploadResults
            }
        };
    } catch (error) {
        console.error(error);
        context.res = {
            status: 500,
            body: {
                message: 'Failed to upload files',
                error: error.message
            }
        };
    }
};
