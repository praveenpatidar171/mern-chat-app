import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { useChatState } from "../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/Chatslogic";
import { ProfileModal } from "./miscellaneous/ProfileModal";
import { UpdateGroupChatModal } from "./miscellaneous/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import './style.css'
import { ScrollableChat } from "./ScrollableChat";
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from "../animations/typing.json";

const ENDPOINT = 'http://localhost:5000'

let socket, selectedChatCompare;

export const SingleChat = ({ fetchagain, setFetchagain }) => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("");
    const [socketconnected, setSocketconnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIstyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { user, selectedChat, setSelectedChat, notification, setNotification } = useChatState();
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    // "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);

            // console.log(data);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: error.message || "Failed to send the message",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketconnected(true));
        socket.on('typing', () => setIstyping(true));
        socket.on('stop typing', () => setIstyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification 
               if(!notification.includes(newMessageRecieved)){
                setNotification([newMessageRecieved, ...notification]);
                setFetchagain(!fetchagain);
               }

            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("");
                const { data } = await axios.post("http://localhost:5000/api/message/", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);

                // console.log(data);

                socket.emit('new message', data);

                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: 'Error Occured!!',
                    description: error.message || "Failed to send the message",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });

            }
        }
    }
    

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // Typing indicator logic

        if (!socketconnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingtime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingtime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);

    }
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent={{ base: "space-between" }}
                        alignItems='center'
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchagain={fetchagain}
                                        setFetchagain={setFetchagain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )
                        }

                    </Text>

                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        w='100%'
                        bg='#E8E8E8'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                h={20}
                                w={20}
                                alignSelf='center'
                                margin='auto'
                            />
                        ) : (
                            <div className="messages">

                                <ScrollableChat messages={messages} />

                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>

                            {istyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </div>
                                : <></>}
                            <Input
                                placeholder="enter a message.."
                                mb={1}
                                value={newMessage}
                                onChange={typingHandler}
                                variant='filled'
                                bg="E0E0E0"
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                    <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
                        Click on a User to Start chatting!!
                    </Text>
                </Box>
            )}
        </>
    )
}