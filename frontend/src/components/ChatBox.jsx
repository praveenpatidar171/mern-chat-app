import { Box } from "@chakra-ui/react";
import { useChatState } from "../Context/ChatProvider";
import { SingleChat } from "./SingleChat";

export const ChatBox = ({fetchagain, setFetchagain})=>{

    const { user, selectedChat, setSelectedChat, chats, setChats } = useChatState();
    return(
        <Box
         display={{base: selectedChat? "flex" : "none" , md: "flex"}}
        alignItems='center'
        flexDir='column'
        p={3}
        bg='white'
        borderRadius='lg'
        borderWidth='1px'
        w={{base: "100%" , md: "68%"}}
        >
           <SingleChat fetchagain={fetchagain} setFetchagain={setFetchagain} />
        </Box>
    )
}