'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'; // Importación directa

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default function ChakraUIProvider({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
