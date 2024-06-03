import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, flexbox, useDisclosure, useToast } from "@chakra-ui/react"
import { useChatState } from "../../Context/ChatProvider"
import { useState } from "react"
import axios from "axios"
import { UserList } from "../../Context/UserList"
import { UserBadgeItem } from "../UserAvtar/UserBadgeItem"

export const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedUsers, seTselectedUsers] = useState([])
    const [groupName, seTgroupName] = useState()
    const [loading, seTloading] = useState(false)
    const [search, setSearch] = useState("")
    const [searchresult, setSearchresult] = useState([])

    const toast = useToast();
    const { user, chats, setChats } = useChatState();

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

    const addUser = (userToadd) => {
        if (selectedUsers.includes(userToadd)) {
            toast({
                title: 'User already included!!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        seTselectedUsers([...selectedUsers, userToadd]);
    }

    const deleteUser = (userTodelId) => {
        seTselectedUsers(selectedUsers.filter((fil) => fil._id !== userTodelId));
    }
    const handleSubmit = async () => {
        if (!groupName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return;
        }

        try {
            // seTloading(true);
            const config = {
                headers: {
                    // "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("http://localhost:5000/api/chat/group", {
                name: groupName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);
           
            
            // console.log(data);
            // seTloading(false);
            setChats([data, ...chats])
            onClose();
            toast({
                title: 'New Group Chat created successfully!!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        } catch (error) {
            toast({
                title: 'Error Occured!!',
                description: error.message || "Failed to create the group chat",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        }

    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center'>
                        <FormControl>
                            <Input placeholder="Chat Name" mb={3} onChange={(e) => seTgroupName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users eg: Praveen, John, Jane" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedUsers.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => deleteUser(user._id)} />
                            ))}
                        </Box>
                        {loading ? (<p>Loading...</p>) : searchresult.slice(0, 4).map((user) => (
                            <UserList key={user._id} user={user} handleFunction={() => addUser(user)} />
                        ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}