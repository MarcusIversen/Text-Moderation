import * as React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import {ThemeProvider} from "@mui/material/styles";
import {defaultTheme} from "../../assets/theme.ts";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {useState} from "react";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom";

export const SideBar: React.FunctionComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const cookies = new Cookies();
  const navigate = useNavigate();


  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
      localStorage.clear();
      cookies.remove("AuthCookie");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  };


  return (
      <ThemeProvider theme={defaultTheme}>
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              width: "280px",
              flexShrink: 0,
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
            <ListItem button sx={{borderRadius: 2}}>
              <ListItemIcon>
                <img
                    src="../IconLogo.png"
                    alt="logo"
                    width="32px"
                    height="32px"
                />
              </ListItemIcon>
              <ListItemText
                  primary="New input"
                  sx={{color: "white", paddingTop: 0.2}}
              />
              <ListItemIcon sx={{color: "primary.main", paddingLeft: 3}}>
                <AddCircleOutlineIcon/>
              </ListItemIcon>
            </ListItem>
          </List>
          <List sx={{paddingLeft: 1, paddingRight: 1, flex: 1, overflow: "auto"}}>
            <ListItem>
              <ListItemText primary="Previous text moderations" sx={{color: "grey"}}/>
            </ListItem>
          </List>
          <List sx={{paddingLeft: 1, paddingRight: 1, overflow: "hidden"}}>
            <ListItem button sx={{borderRadius: 2}} onClick={handleMenuClick}>
              <AccountCircleIcon sx={{color: "primary.main", width: "30px", height: "30px"}}/>
              <ListItemText primary="Username Username" sx={{color: "white", paddingLeft: 2}}/>
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
            <MenuItem onClick={handleLogout} sx={{width: "253px"}}>
              <LogoutIcon sx={{paddingRight: 1, width: "32px", height: "32px"}}/>
              Logout
            </MenuItem>
          </Menu>
      </ThemeProvider>
  );
};
