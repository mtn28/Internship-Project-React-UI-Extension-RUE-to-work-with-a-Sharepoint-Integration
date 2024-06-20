import React, { useState, useEffect } from 'react';
import { Link, Button, Text, Box, Flex, hubspot, LoadingSpinner, Alert, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hubspot/ui-extensions";

// Define the Files interface
interface Files {
  blobName: string;
  link: string;
}

// Extend HubSpot to include the custom tab
hubspot.extend<'crm.record.tab'>(({ actions }) => <Extension openIframe={actions.openIframeModal} />);

// The main Extension component
const Extension = ({ openIframe }) => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<Files[]>([]);
  const [error, setError] = useState('');

  // Function to handle button click
  const handleClick = () => {
    openIframe({
      uri: "https://react-card-for-upload-to-sharepoint.vercel.app/",
      height: 640,
      width: 480,
    });
  };

  // useEffect hook to fetch files when component mounts
  useEffect(() => {
    hubspot
      .serverless('fetchFiles')
      .then((response) => {
        setLoading(false);
        setFiles(response);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, []);

  // Render a loading spinner while data is being fetched
  if (loading) {
    return <LoadingSpinner label="Fetching files..." />;
  }

  // Render an error alert if there's an error
  if (error) {
    return <Alert title="Error">{error}</Alert>;
  }

  // Render the main UI
  return (
    <Flex direction="column" align="start" gap="medium">
      <Text>Here you can upload new files.</Text>
      <Box>
        <Button type="button" onClick={handleClick}>
          Upload Files...
        </Button>
      </Box>
      <Text>Files</Text>
      <Table bordered={true}>
        <TableHead>
          <TableRow>
            <TableHeader>Owner</TableHeader>
            <TableHeader>File Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.blobName}>
              <TableCell>Michael Nunes</TableCell>
              <TableCell>
                <Link href={file.link}>{file.blobName}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
};

export default Extension;
