import * as React from 'react';
import {Drawer, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TagFacesIcon from '@mui/icons-material/TagFaces';import {ThemeProvider} from "@mui/material/styles";
import {defaultTheme} from "../assets/theme.ts";

export const SideBar: React.FunctionComponent = () => {
  return (
      <ThemeProvider theme={defaultTheme}>
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              width: '280px',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: '280px',
                backgroundColor: defaultTheme.palette.background.default,
                color: defaultTheme.palette.secondary.main,
              },
            }}
        >
          <List>
            <ListItem button sx={{borderRadius: 2}}>
              <ListItemIcon>
                <img src="../IconLogo.png" alt="logo" width="32px" height="32px"/>
              </ListItemIcon>
              <ListItemText primary="New text input" sx={{color: "white", paddingTop: 0.5}}/>
              <ListItemIcon sx={{color: "primary.main", paddingLeft: 3}}>
                <BorderColorIcon/>
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <ListItemText primary="Latest text inputs" sx={{color: "grey"}}/>
            </ListItem>
            <ListItem button sx={{borderRadius: 2}}>
              <ListItemIcon sx={{color: "primary.main"}}>
                <TagFacesIcon/>
              </ListItemIcon>
              Username Username
            </ListItem>
          </List>
        </Drawer>
      </ThemeProvider>
  );
};
