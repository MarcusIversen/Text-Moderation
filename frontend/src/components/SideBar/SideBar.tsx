import * as React from "react";
import {useEffect, useState} from "react";
import {Drawer, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import {ThemeProvider} from "@mui/material/styles";
import {defaultTheme} from "../../theme/theme.ts";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {ModerationService} from "../../services/ModerationService.ts";
import "./SideBar.css";

interface TokenPayload extends JwtPayload {
    id?: string;
    firstName: string;
    lastName: string;
}

interface ModerationInput {
    id: number;
    userID: number;
    textInput: string;
    updatedAt: string;
}


export const SideBar: React.FunctionComponent = (SideBarKey) => {
    const cookies = new Cookies();
    const navigate = useNavigate();

    const moderationService = new ModerationService();
    const cookie = cookies.get("AuthCookie");

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [moderationInputs, setModerationInputs] = useState<ModerationInput[]>([]);


    const decodedCookie = jwtDecode<TokenPayload>(cookie);
    const firstName = decodedCookie.firstName;
    const lastName = decodedCookie.lastName;

    const fetchModerationInputs = async () => {
        try {
            const inputs = await moderationService. getAllModerationInputs(decodedCookie.id);

            // Sort the inputs based on the updatedAt property in descending order
            inputs.sort((a: ModerationInput, b: ModerationInput) => {
                const dateA = new Date(a.updatedAt);
                const dateB = new Date(b.updatedAt);
                return dateB.getTime() - dateA.getTime();
            });

            setModerationInputs(inputs);
        } catch (error) {
            console.error("Error fetching moderation inputs", error);
        }
    }

    useEffect(() => {
        fetchModerationInputs();
    }, [SideBarKey]);

    if (!cookie) return;


    const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        cookies.remove("AuthCookie");
        navigate("/home");
    };

    // If the textInput exceeds 28 characters, truncate it and add "..." at the end
    const truncateText = (text: string): string => {
        const maxLength = 22;
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    // Format the updatedAt property to a more readable format
    const formatDate = (updatedAt: string) => {
        const date = new Date(updatedAt);
        return date.toLocaleTimeString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    };

    function handleItemClick(textInputId: number) {
        navigate("/home/" + textInputId);
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Drawer
                variant="permanent"
                anchor="left"
                className="drawer"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: "280px",
                        backgroundColor: defaultTheme.palette.background.default,
                        color: defaultTheme.palette.secondary.main,
                        display: "flex",
                        flexDirection: "column", // Make it a column flex container
                    },
                }}
            >
                <List sx={{paddingLeft: 1, paddingRight: 1, overflow: "hidden"}}>
                    <ListItem button sx={{borderRadius: 2}} onClick={() => {
                        navigate("/home");
                        window.location.reload();
                    }}>
                        <ListItemIcon>
                            <img
                                src="../IconLogo.png"
                                alt="logo"
                                width="32px"
                                height="32px"
                            />
                        </ListItemIcon>
                        <ListItemText primary="New text input" className="new-input-list-item"/>
                        <ListItemIcon className="circle-icon" sx={{color: "primary.main"}}>
                            <AddCircleOutlineIcon/>
                        </ListItemIcon>
                    </ListItem>
                </List>
                <List className="main-list" sx={{paddingLeft: 1, paddingRight: 1}}>
                    <ListItem className="list-sub-header">
                        <ListItemText primary="Previous text moderations" className="list-sub-header-text"/>
                    </ListItem>
                    {moderationInputs.map((moderationInput, index) => (
                        <ListItem button key={moderationInput.id || index} sx={{borderRadius: 2}}
                                  onClick={() => handleItemClick(moderationInput.id)}
                                  className={index === 0 ? "new-item" : ""}
                                  >
                            <ListItemText sx={{color: "white"}} primary={truncateText(moderationInput.textInput)}
                                          secondary={formatDate(moderationInput.updatedAt)}/>
                        </ListItem>
                    ))}
                </List>
                <List sx={{paddingLeft: 1, paddingRight: 1, overflow: "hidden"}}>
                    <ListItem button sx={{borderRadius: 2}} onClick={handleMenuClick}>
                        <AccountCircleIcon sx={{color: "primary.main"}}/>
                        <ListItemText primary={firstName + " " + lastName} sx={{color: "white", paddingLeft: 2}}/>
                        <MoreVertIcon sx={{paddingLeft: 1, color: "primary.main", width: "30px", height: "30px"}}/>
                    </ListItem>
                </List>
            </Drawer>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={handleLogout} className="logout-menu">
                    <LogoutIcon sx={{paddingRight: 1, width: "32px", height: "32px"}}/>
                    Logout
                </MenuItem>
            </Menu>
        </ThemeProvider>
    );
};

