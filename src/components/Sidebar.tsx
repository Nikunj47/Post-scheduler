import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleDrawer }) => {
    return (
        <>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                className="sidebar-button"
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                variant="persistent"
                open={isOpen}
                className="sidebar"
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" noWrap>
                        Menu
                    </Typography>
                    <IconButton onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><PostAddIcon /></ListItemIcon>
                        <ListItemText primary="Posts" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="Analytics" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Sidebar;
