import { useEffect, useState } from "react";
import { useChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { ChatLoading } from "./ChatLoading";
import { getSender } from "../config/Chatslogic";
import { GroupChatModal } from "./miscellaneous/GroupChatModal";

export const Mychats = ({ fetchagain }) => {
    const [loggedUser, seTloggedUser] = useState(null);
    const { user, selectedChat, setSelectedChat, chats, setChats } = useChatState();
    const toast = useToast();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                seTloggedUser(userInfo);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.get("http://localhost:5000/api/chat/", config);
                setChats(data);
                // console.log(data);

            } catch (error) {
                toast({
                    title: 'Error Occured!!',
                    description: error.message || "Failed to Load the chats",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });

            }
        }
        fetchChats();
    }, [fetchagain])
    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir='column'
            alignItems='center'
            p={3}
            bg='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box pb={3} px={3} fontSize={{ base: '28px', md: '30px' }} fontFamily='Work sans' display='flex' w='100%' justifyContent='space-between' alignItems='center'>
                My Chats
                <GroupChatModal>
                    <Button
                        display='flex'
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box display='flex' flexDir='column' p={3} bg='#F8F8F8' w='100%' h='100%' borderRadius='lg' overflowY='hidden'>
                {
                    chats ? (
                        <Stack overflowY='scroll'>
                            {chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor='pointer'
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius='lg'
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )
                }
            </Box>
        </Box>
    )
}