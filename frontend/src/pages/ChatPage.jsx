import { Box, Container } from "@chakra-ui/react";
import { useChatState } from "../Context/ChatProvider"
import { SideDrawer } from "../components/miscellaneous/SideDrawer";
import { Mychats } from "../components/Mychats";
import { ChatBox } from "../components/ChatBox";
import { useState } from "react";

export const ChatPage = () => {
    const { user } = useChatState();
    const [fetchagain, setFetchagain] = useState(false);
    return <div style={{ width: "100%" }}>
        {user && <SideDrawer />}

        <Box display='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px' >
            {user && <Mychats fetchagain={fetchagain} />}
            {user && <ChatBox fetchagain={fetchagain} setFetchagain={setFetchagain} />}
        </Box>

    </div>
}