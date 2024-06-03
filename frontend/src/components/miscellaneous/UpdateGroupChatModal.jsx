import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import { useChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import { UserBadgeItem } from "../UserAvtar/UserBadgeItem";
import axios from "axios";
import { UserList } from "../../Context/UserList";


export const UpdateGroupChatModal = ({ fetchagain, setFetchagain ,fetchMessages}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = useChatState();
    const [groupChatName, seTgroupChatName] = useState("")
    const [loading, seTloading] = useState(false)
    const [search, setSearch] = useState("")
    const [searchresult, setSearchresult] = useState([])
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast();

    const handleRemove = async(user1) => {
         if(selectedChat.groupAdmin._id !== user._id &&  user1._id !== user._id){
            toast({
                title: 'Only admin can remove from the Group!!',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
         }

         try {
            seTloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("http://localhost:5000/api/chat/removegroup",{
                chatId : selectedChat._id,
                userId : user1._id,
            }, config);
            
            // console.log(data);
            user1._id === user._id ? setSelectedChat(): setSelectedChat(data);
            // setSelectedChat(data);
            setFetchagain(!fetchagain);
            fetchMessages();
            seTloading(false);
            
        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: error.message || "Failed to add the User",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            seTloading(false);
        }


    }
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    // "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("http://localhost:5000/api/chat/rename", {
                chatName: groupChatName,
                chatId: selectedChat._id,
            }, config);


            // console.log(data.chatName);
            // seTloading(false);
            setSelectedChat(data);
            // seTgroupChatName(data.chatName);
            setFetchagain(!fetchagain);
            setRenameLoading(false);
            
        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: error.message || "Failed to rename the group chat",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
            seTgroupChatName("");
        }

    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
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
            const finaldata = data.users;
            // console.log(data);
            // console.log(finaldata);
            seTloading(false);
            setSearchresult(finaldata);


        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: error.message || "Failed to Load the chats",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            seTloading(false);
        }
    }
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User is already in the Group!!',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin can add someone in the Group!!',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            seTloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("http://localhost:5000/api/chat/addgroup",{
                chatId : selectedChat._id,
                userId : user1._id,
            }, config);
            
            // console.log(data);
            setSelectedChat(data);
            setFetchagain(!fetchagain);
            seTloading(false);
            
        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: error.message || "Failed to add the User",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            seTloading(false);
        }

    }
    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                            ))}
                        </Box>

                        <FormControl display='flex'>
                            <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e) => seTgroupChatName(e.target.value)} />
                            <Button
                                variant='solid'
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add User to the group" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        {loading ? (
                            <Spinner
                                size='lg'
                            />
                        ) : (
                            searchresult?.map((user) => (
                                <UserList key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}