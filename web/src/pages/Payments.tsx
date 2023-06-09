import { Button, Center, FormControl, FormLabel, Heading, Input, Text, VStack, useToast, } from "@chakra-ui/react";
import { startAuthentication } from '@simplewebauthn/browser';
import { useState } from "react";
import { api } from "../services/api";
import { useAppSelector } from "../store";

export default function Payments() {

    const [amount, setAmount] = useState(0)

    const toast = useToast()

    const {
        userSession
    } = useAppSelector(state => state.userSession)

    const sendPayment = async () => {

        const response = await api.post('/auth-options', {
            email: userSession
        });

        const options = response.data

        const authRes = await startAuthentication(options);
        try {
            await api.post('/payments', { data: authRes, email: userSession, paymentData: { value: 100 } });
            toast({
                title: "Payment sent!",
                description: "We've successfully send your payment.",
                status: "success",
                duration: 9000,
            })
        } catch {
            toast({
                title: "Failed in payment.",
                description: "Could not send payment",
                status: "error",
                duration: 9000,
            })
        }
    }

    return (
        <>
            <Center h="100vh">
                <VStack border="1px solid" borderColor="blue.500" p={5} rounded="md">
                    <Heading mb="10">Pay with WebAuthn</Heading>
                    <FormControl isRequired>
                        <FormLabel>Amount</FormLabel>
                        <Input
                            type="number"
                            onChange={(e) => setAmount(Number(e.target.value))}
                            value={amount}
                            autoComplete="amount"
                            isRequired
                        />
                    </FormControl>
                    <Button onClick={sendPayment}>Send Payment</Button>
                </VStack>
            </Center>
        </>
    );
}
