import NavBar from "./components/webHome/NavBar/NavBar";
import { Banner } from "./components/webHome/Banner/banner";
import { Suscripcion } from "./components/webHome/Sucripcion/suscripcion";
import { Info } from "./components/webHome/Info/info";
import Nclientes from "./components/webHome/NClientes/nclientes";
import { Reviews } from "./components/webHome/Reseñas/reseñas";
import { PiePagina } from "./components/webHome/PiePagina/piepagina";

import { Box } from "@chakra-ui/react";


const Home = () => {
  return (
    <Box>
      {/* <Box as="section" bg="white" py={8}>
        <NavBar />
      </Box> */}

      <Box as="section" bg="gray.100">
        <Banner />
      </Box>

      <Box as="section" bg="blue.50" py={2}>
        <Suscripcion />
      </Box>

      <Box as="section" py={16}>
        <Nclientes />
      </Box>

      <Box 
      as="section"  py={6}>
        <Info />
      </Box>

      <Box as="section" bg="gray.100" py={16}>
        <Reviews />
      </Box>
      
      <Box as="section" bg="white" py={8}>
        <PiePagina />
      </Box>
    </Box>
  );
};

export default Home;

