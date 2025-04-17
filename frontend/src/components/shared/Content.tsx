import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

type ContentProps = {
    children?: any;
}

const Content: React.FC<ContentProps> = ({ children }) => {

    return (
        <Box margin='auto'>
            <Toolbar />
            {children}
        </Box>
    );
}

export default Content;