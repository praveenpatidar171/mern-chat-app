import { CloseIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"

export const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            px={2}
            py={1}
            borderRadius='lg'
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            style={{ backgroundColor: 'purple', color: 'white' }}
            cursor='pointer'
        >
            <Box  >
                {user.name}
                <CloseIcon pl={1} />
            </Box>
        </Box>
    )
}