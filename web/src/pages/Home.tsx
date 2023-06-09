import { Button, Center, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/', { replace: true });
  };

  return (
    <Center h="100vh">
      <VStack>
        <Heading>Congrats you're authenticated!!</Heading>
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={() => navigate('/payments')}>Payments</Button>
      </VStack>
    </Center>
  );
};
