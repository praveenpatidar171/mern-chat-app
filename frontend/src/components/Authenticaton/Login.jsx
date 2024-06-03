import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const Login = () => {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const handleClick = () => {
        setShow(!show);
    }
   
    const submithandler = async () => {
        setLoading(true);
        if (!password || !email ) {
            toast({
                title: 'Please fill all the fields.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/user/login', {email, password}, config);
            toast({
                title: 'Login Successfull.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'Error Occured.',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
        }
    }


    return <VStack>
        <FormControl id="email1" isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} placeholder="Enter Your Email" onChange={(e) => { setEmail(e.target.value) }} />
        </FormControl>
        <FormControl id="password1" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? 'text' : "password"} value={password} placeholder="Enter Your Password" onChange={(e) => { setPassword(e.target.value) }} />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button colorScheme="blue" width="100%" mt="15px" onClick={submithandler} isLoading = {loading}>
            Login
        </Button>
        <Button
            variant="solid"
            colorScheme="red"
            width="100%"
            onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
            }}
        >
            Get Guest User Credentials
        </Button>
    </VStack>
}