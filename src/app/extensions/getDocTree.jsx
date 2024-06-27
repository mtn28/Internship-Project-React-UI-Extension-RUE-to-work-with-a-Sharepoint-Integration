import React, { useState } from 'react';
import { Button, Divider, Tile, Link, hubspot, Flex, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Card, LoadingSpinner, Alert, Box, Image, Text } from '@hubspot/ui-extensions';

const headerStyle = {
  fontSize: '0.8em'
};

hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    sendAlert={actions.addAlert}
    openIframe={actions.openIframeModal}
  />
));

const Extension = ({ context, runServerless, sendAlert, openIframe }) => {
  const [email, setEmail] = useState('');
  const [objectType, setObjectType] = useState('');
  const [objectId, setObjectId] = useState('');
  const [data, setData] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (itemId) => {
    try {
      setLoading(true);
      const result = await runServerless({
        name: 'download',
        parameters: { itemId, email }
      });
      setLoading(false);

      if (result.response.statusCode === 200) {
        const fetchedDownloadUrl = result.response.body.data.trim();
        console.log('Download URL:', fetchedDownloadUrl);
        sendAlert({ message: 'URL de download obtido com sucesso!', type: 'success' });
        setDownloadUrls(prevUrls => ({ ...prevUrls, [itemId]: fetchedDownloadUrl }));
      } else {
        sendAlert({ message: 'Erro ao obter URL de download...', type: 'error' });
      }
    } catch (error) {
      setLoading(false);
      sendAlert({ message: 'Erro ao obter URL de download...', type: 'error' });
      console.error('Erro:', error);
    }
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      const result = await runServerless({
        name: 'getDocTree',
        parameters: {
          email,
          hubspotObjectType: objectType,
          hubspotObjectId: objectId
        }
      });
      setLoading(false);

      if (result.response.statusCode === 200) {
        setData(result.response.body.data);
        sendAlert({ message: 'Lista carregada com sucesso', type: 'success' });
      } else if (result.response.statusCode === 401) {
        sendAlert({ message: 'Não autenticado...', type: 'error' });
      } else {
        sendAlert({ message: 'Erro ao buscar dados...', type: 'error' });
      }
    } catch (error) {
      setLoading(false);
      sendAlert({ message: 'Erro ao buscar dados...', type: 'error' });
      console.error('Erro:', error);
    }
  };

  const handleUploadClick = () => {
    openIframe({
      uri: "https://upload-to-sharepoint.vercel.app/",
      height: 1000,
      width: 1000,
      title: 'Upload to SharePoint',
      flush: true,
    });
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else if (size < 1073741824) return `${(size / 1048576).toFixed(2)} MB`;
    else return `${(size / 1073741824).toFixed(2)} GB`;
  };

  const getFileExtension = (item) => {
    if (item.type === 'folder') return 'N/A';
    const extension = item.fullPath.split('.').pop();
    return extension === item.fullPath ? 'N/A' : extension;
  };

  return (
    <Flex direction="column" align="start" gap="medium" style={{ padding: '16px', width: '100%' }}>
      {error && <Alert type="error" title="Erro" description={error} />}
      <Card>
        <Card>
          <Text>
            This UI extension is designed to fetch files and folders from your Microsoft SharePoint account.
          </Text>
        </Card>
        <Card>
          <Text>
            Additionally, it provides an option to upload files directly from HubSpot to your Microsoft SharePoint account.
          </Text>
        </Card>
        <Divider />
        <Card>
          <Button type="submit" onClick={handleClick}>
            List Content
          </Button>
          <Card>
            <Text></Text>
          </Card>
          <Text>
            The files and folders will be listed once you click the{' '}
            <Text inline={true} format={{ fontWeight: 'bold' }}>
              List Content
            </Text>{' '}
            button.
          </Text>
        </Card>
        <Card>
          <Text></Text>
        </Card>
        <Card>
          <Button type="button" onClick={handleUploadClick}>
            Upload Files
          </Button>
          <Card>
            <Text></Text>
          </Card>
          <Text>
            The{' '}
            <Text inline={true} format={{ fontWeight: 'bold' }}>
              Upload Files
            </Text>{' '}
            button is used to send files to SharePoint. Clicking on it will open a modal iframe to perform the upload service.
          </Text>
        </Card>
        <Divider />
        <Card>
          <Text></Text>
        </Card>
        <Card>
          <Card>
            <Text></Text>
          </Card>
          <Card>
            <Text></Text>
          </Card>
          <Tile compact={true}>
            <Text inline={true} format={{ fontWeight: 'bold' }}>
              You will see the files and folders below with their details after fetching the content ⇩
            </Text>
          </Tile>
          {loading && <LoadingSpinner />}
        </Card>
      </Card>
      {data && (
        <Table bordered={true} style={{ marginTop: '24px', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableHeader style={headerStyle}>Name</TableHeader>
            <TableHeader style={headerStyle}>Type</TableHeader>
            <TableHeader style={headerStyle}>Size</TableHeader>
            <TableHeader style={headerStyle}>Extension</TableHeader>
            <TableHeader style={headerStyle}>Added Date</TableHeader>
            <TableHeader style={headerStyle}>Download</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Link href={item.webUrl} openInNewTab>
                  {item.name.split('.')[0]}
                </Link>
              </TableCell>
              <TableCell>{item.type === 'file' ? 'File 📄' : 'Folder 📁'}</TableCell>
              <TableCell>{item.size ? formatFileSize(item.size) : 'N/A'}</TableCell>
              <TableCell>{getFileExtension(item)}</TableCell>
              <TableCell>{new Date(item.createdDateTime).toLocaleDateString()}</TableCell>
              <TableCell>
                {item.type === 'file' ? (
                  downloadUrls[item.id] ? (
                    <Link href={downloadUrls[item.id]} openInNewTab>
                      ➩ Click to Begin the Download
                    </Link>
                  ) : (
                    <Button onClick={() => handleDownload(item.id)} color="link">Get Download URL</Button>
                  )
                ) : (
                  'N/A'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <Box style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Microsoft_logo_-_2012_%28vertical%29.svg"
          alt="Microsoft"
          width={40}
          height={50}
        />
        <Image
          src="https://www.logo.wine/a/logo/SharePoint/SharePoint-Logo.wine.svg"
          alt="SharePoint"
          width={60}
          height={60}
        />
      </Box>
    </Flex>
  );
};

export default Extension;


