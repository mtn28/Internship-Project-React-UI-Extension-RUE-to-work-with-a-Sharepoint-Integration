import React from "react";
import { Button, Text, Box, Flex, Image, hubspot } from "@hubspot/ui-extensions";

hubspot.extend(({ actions }) => <Extension openIframe={actions.openIframeModal} />);

const Extension = ({ openIframe }) => {

  const handleClick = () => {
    openIframe({
      uri: "https://microsoft-sharepoint-authentication.vercel.app/",
      height: 1000,
      width: 1000,
      title: 'SignIn with Microsoft',
      flush: true,
    });
  };

  return (
    <>
      <Flex direction="column" align="start" gap="medium" style={{ position: 'relative' }}>
      <Text>
  Clicking the{' '}
  <Text inline={true} format={{ fontWeight: 'bold' }}>
    Sign In
  </Text>{' '}
  button will open a modal iframe. 
</Text>
<Text>Use the modal iframe to sign in with your Microsoft account and access your SharePoint instances.</Text>


        <Box>
          <Button type="submit" onClick={handleClick}>
            Sign In with Microsoft
          </Button>
        </Box>

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
    </>
  );
};

export default Extension;
