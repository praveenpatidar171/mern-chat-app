import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from "react"
import { useChatState } from "../../Context/ChatProvider";
import { ProfileModal } from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatLoading } from "../ChatLoading";
import { UserList } from "../../Context/UserList";
import { getSender } from "../../config/Chatslogic";
import { NotificationBadge } from "./NotificationBadge";
// import {Effect, NotificationBadge} from  ' react-lottie@1.2.4 '


export const SideDrawer = () => {
    const [search, seTsearch] = useState("");
    const [searchresult, seTsearchresult] = useState([]);
    const [loading, seTloading] = useState(false);
    const [loadingChat, seTloadingChat] = useState(false);
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = useChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/')
    }

    const searchHandler = async () => {
        if (!search) {
            toast({
                title: 'Please enter something to search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }

        try {
            seTloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            const finalarray = data.users;

            seTloading(false);
            seTsearchresult(finalarray);
            // console.log(searchresult);
        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: "Failed to Load the results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });

        }
    }
    const accessChat = async (userId) => {
        try {
            seTloadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post('http://localhost:5000/api/chat/', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            setSelectedChat(data);
            seTloadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: 'Error fetching the data!!',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    return (<>
        <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            w='100%'
            bg='white'
            borderWidth='5px'
            p='5px 10px 5px 10px'

        >
            <Tooltip label="Search Users to Chat" hasArrow placeContent="bottom-end">
                <Button variant="ghost" onClick={onOpen}>
                    {/* <i class="fa-solid fa-magnifying-glass fa-sm"></i> */}
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: "none", md: "flex" }} px='4'>Search User</Text>
                </Button>
            </Tooltip>
            <Text fontSize='2xl' fontFamily='Work sans'>
                BlinkChat
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}  >
                        <NotificationBadge />
                        <BellIcon fontSize='2xl' m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "NO New Messages!!"}
                        {notification.map((notif) => (
                            <MenuItem key={notif._id} onClick={() => {
                                setSelectedChat(notif.chat);
                                setNotification(notification.filter((f) => f !== notif));
                            }}>
                                {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />

                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            {/* children */}
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>

                        <MenuDivider />
                        <MenuItem onClick={logoutHandler} >Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box >
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>

                <DrawerBody>
                    <Box display='flex' pb={2}>
                        <Input placeholder='Search by Name or Email' mr={2} value={search} onChange={(e) => { seTsearch(e.target.value) }} />
                        <Button onClick={searchHandler}>Go</Button>
                    </Box>
                    {loading ? (<ChatLoading />) :
                        (
                            searchresult?.map((user) => (<UserList key={user._id} user={user} handleFunction={() => accessChat(user._id)} />))
                        )}
                    {loadingChat && <Spinner display='flex' ml='auto' />}
                </DrawerBody>


            </DrawerContent>
        </Drawer>
    </>
    )
}