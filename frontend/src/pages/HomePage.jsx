import { Box, Container, Text, Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react"
import { Login } from "../components/Authenticaton/Login"
import { SignUp } from "../components/Authenticaton/SignUp"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        // setUser(userinfo);
        if (user) {
            navigate('/chats')
        }
    }, [navigate])

    return <Container maxW='xl' centerContent>
        <Box
            d="flex"
            justifyContent="center"
            p={3}
            bg="white"
            w='100%'
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        >
            <Text display="flex" justifyContent="center" alignItems="center" fontSize="4xl" fontFamily="Work sans" color="black">BlinkChat</Text>
        </Box>
        <Box bg="white" w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px">
            <Tabs variant='soft-rounded'>
                <TabList mb="1em">
                    <Tab width="50%">Login</Tab>
                    <Tab width="50%">Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <SignUp />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
}