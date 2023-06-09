import { Button, Center, FormControl, FormLabel, Heading, Input, Text, VStack, useToast, } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { startRegistration } from '@simplewebauthn/browser';
import { useState } from "react";
import { api } from "../services/api";

export default function RegisterPage() {

    const toast = useToast()
    const [username, setUsername] = useState('')

    const handleRegistration = async () => {
        const response = await api.post('/registration-options', {
            email: username
        });

        let options = response.data
        options.authenticatorSelection.residentKey = 'required'
        options.authenticatorSelection.requireResidentKey = true
        options.extensions = {
            credProps: true,
        }
        const authRes = await startRegistration(options);
        const verificationResponse = await api.post('/registration-verification', { data: authRes, email: username });
        if (verificationResponse.data.ok) {
            toast({
                title: "Account created.",
                description: "We've created your account for you.",
                status: "success",
                duration: 9000,
            })
        } else {
            toast({
                title: "Account not created.",
                description: "We've not created your account for you",
                status: "error",
                duration: 9000,
            })
        }
    }

    return (
        <>
            <Center h="100vh">
                <VStack border="1px solid" borderColor="blue.500" p={5} rounded="md">
                    <Heading mb="10">Register with WebAuthn</Heading>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            autoComplete="username" type="text" isRequired />
                    </FormControl>
                    <Button onClick={handleRegistration}>Register</Button>
                    <Link to="/">
                        <Text color="blue.500" fontWeight={500}>
                            Sign in instead
                        </Text>
                    </Link>
                </VStack>
            </Center>
        </>
    );
}
