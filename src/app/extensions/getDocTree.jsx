import React, { useState } from 'react';
import { Button, Input, Link, hubspot, Flex, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@hubspot/ui-extensions';

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

  const handleDownload = async (itemId) => {
    runServerless({ 
      name: 'download', 
      parameters: { itemId: itemId, email: email } 
    }).then((result) => {
      if (result.response.statusCode === 200) {
        console.log(result.response.body);
        sendAlert({ message: 'Download URL fetched successfully!', type: 'success' });
      } else {
        sendAlert({ message: 'Error fetching download URL...', type: 'error' });
      }
    }).catch(error => {
      sendAlert({ message: 'Error fetching download URL...', type: 'error' });
    });
  };

  const handleClick = async () => {
    runServerless({ 
      name: 'getDocTree', 
      parameters: { 
        email: email, 
        hubspotObjectType: objectType, 
        hubspotObjectId: objectId 
      } 
    }).then((result) => {
      if (result.response.statusCode === 200) {
        setData(result.response.body.data);
        sendAlert({ message: 'Lista carregada com sucesso', type: 'success' });
      } else if (result.response.statusCode === 401) {
        sendAlert({ message: 'Unauthenticated...', type: 'error' });
      } else {
        sendAlert({ message: 'Error fetching data...', type: 'error' });
      }
    }).catch(error => {
      sendAlert({ message: 'Error fetching data...', type: 'error' });
    });
  };

  const handleUploadClick = () => {
    openIframe({
      uri: "https://144183980.hs-sites-eu1.com/upload",
      height: 640,
      width: 480,
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
    <Flex direction="column" align="start" gap="medium">
      <Input
        name="Email"
        label="Email:"
        onInput={(value) => setEmail(value)}
      />
      <Input
        name="Object Type"
        label="Folder Name:"
        onInput={(value) => setObjectType(value)}
      />
      <Input
        name="Object Id"
        label="Sub Folder"
        onInput={(value) => setObjectId(value)}
      />
      <Button type="submit" onClick={handleClick}>
        List Content
      </Button>
      <Button type="button" onClick={handleUploadClick}>
        Upload Files
      </Button>
      {data && (
        <Table bordered={true}>
          <TableHead>
            <TableRow>
              <TableHeader style={headerStyle}>Nome</TableHeader>
              <TableHeader style={headerStyle}>Tipo</TableHeader>
              <TableHeader style={headerStyle}>Tamanho</TableHeader>
              <TableHeader style={headerStyle}>Extensão</TableHeader>
              <TableHeader style={headerStyle}>Data de Inserção</TableHeader>
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
                <TableCell>{item.type === 'file' ? 'Ficheiro 📄' : 'Pasta 📁'}</TableCell>
                <TableCell>{item.size ? formatFileSize(item.size) : 'N/A'}</TableCell>
                <TableCell>{getFileExtension(item)}</TableCell>
                <TableCell>{new Date(item.createdDateTime).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDownload(item.id)}>Download</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Flex>
  );
};

export default Extension;
