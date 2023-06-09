import { Button, Center, FormControl, FormLabel, Heading, Input, Text, VStack, useToast, } from "@chakra-ui/react";
import { startAuthentication } from '@simplewebauthn/browser';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function LoginPage() {

    const [username, setUsername] = useState('')

    const toast = useToast()

    const navigate = useNavigate()

    const handleLogin = async () => {

        const response = await api.post('/login-options', {
            email: username
        });

        const options = response.data

        const authRes = await startAuthentication(options);
        const verificationResponse = await api.post('/login-verification', { data: authRes, email: username });

        if (verificationResponse.data.ok) {
            navigate('/dashboard')
            toast({
                title: "Login success.",
                description: "We've logged you in.",
                status: "success",
                duration: 9000,
            })
        } else {
            toast({
                title: "Login failed.",
                description: "Could not sign in",
                status: "error",
                duration: 9000,
            })
        }
    }

    return (
        <>
            <Center h="100vh">
                <VStack border="1px solid" borderColor="blue.500" p={5} rounded="md">
                    <Heading mb="10">Sign in with WebAuthn</Heading>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            autoComplete="username"
                            isRequired
                        />
                    </FormControl>
                    <Button onClick={handleLogin}>Sign in</Button>
                    <Link to="/register" >
                        <Text color="blue.500" fontWeight={500}>
                            Create account
                        </Text>
                    </Link>
                </VStack>
            </Center>
        </>
    );
}
