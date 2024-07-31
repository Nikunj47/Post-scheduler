import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    Card,
    CardContent,
    CardActions,
    IconButton,
    CssBaseline,
    createTheme,
    ThemeProvider,
    AppBar,
    Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Sidebar from './components/Sidebar.tsx';

// Import the logos
import linkedinLogo from './assets/linkedin.jpg';
import facebookLogo from './assets/facebook.jpg';
import instagramLogo from './assets/instagram.jpg';

const client = generateClient<Schema>();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        primary: {
            main: '#1abc9c',
        },
        secondary: {
            main: '#e74c3c',
        },
        text: {
            primary: '#2e2e2e',
        },
    },
});

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
    const [linkedIn, setLinkedIn] = useState<boolean>(false);
    const [facebook, setFacebook] = useState<boolean>(false);
    const [instagram, setInstagram] = useState<boolean>(false);
    const [showFullBody, setShowFullBody] = useState<{ [key: string]: boolean }>({});
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        const currentDateTime = new Date();
        const selectedDateTime = new Date(`${date}T${time}`);

        if (!title || !body) {
            alert("Both title and body are required");
            return;
        }

        if (selectedDateTime <= currentDateTime) {
            alert("The selected date and time must be in the future.");
            return;
        }

        client.models.Todo.create({
            title,
            body,
            date: selectedDateTime.toISOString(),
            LinkedIn: linkedIn,
            Facebook: facebook,
            Instagram: instagram,
        });

        setTitle("");
        setBody("");
        setDate("");
        setTime("");
        setLinkedIn(false);
        setFacebook(false);
        setInstagram(false);
    }

    function startEdit(todo: Schema["Todo"]["type"]) {
        setTitle(todo.title ?? "");
        setBody(todo.body ?? "");
        setDate(todo.date ? new Date(todo.date).toISOString().split('T')[0] : "");
        setTime(todo.date ? new Date(todo.date).toISOString().split('T')[1].slice(0, 5) : "");
        setLinkedIn(todo.LinkedIn ?? false);
        setFacebook(todo.Facebook ?? false);
        setInstagram(todo.Instagram ?? false);
        setCurrentTodoId(todo.id);
        setIsEditing(true);
    }

    function saveTodo() {
        const currentDateTime = new Date();
        const selectedDateTime = new Date(`${date}T${time}`);

        if (!currentTodoId || !title || !body) {
            alert("Both title and body are required");
            return;
        }

        if (selectedDateTime <= currentDateTime) {
            alert("The selected date and time must be in the future.");
            return;
        }

        client.models.Todo.update({
            id: currentTodoId,
            title,
            body,
            date: selectedDateTime.toISOString(),
            LinkedIn: linkedIn,
            Facebook: facebook,
            Instagram: instagram,
        });

        setTitle("");
        setBody("");
        setDate("");
        setTime("");
        setLinkedIn(false);
        setFacebook(false);
        setInstagram(false);
        setIsEditing(false);
        setCurrentTodoId(null);
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

    const truncateBody = (body: string, maxLength: number) => {
        if (body.length > maxLength) {
            return body.substring(0, maxLength) + "...";
        }
        return body;
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Authenticator>
                {({ signOut }) => (
                    <Box sx={{ display: 'flex', height: '100vh' }}>
                        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={toggleDrawer}
                                    sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" noWrap component="div">
                                    My App
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Sidebar isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
                        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: 'auto' }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Posts
                            </Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                <TextField
                                    label="Todo title"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <TextField
                                    label="Todo body"
                                    variant="outlined"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    multiline
                                    rows={4}
                                />
                                <TextField
                                    label="Todo date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <TextField
                                    label="Todo time"
                                    type="time"
                                    InputLabelProps={{ shrink: true }}
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                                <Box>
                                    <FormControlLabel
                                        control={<Checkbox checked={linkedIn} onChange={(e) => setLinkedIn(e.target.checked)} />}
                                        label="LinkedIn"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={facebook} onChange={(e) => setFacebook(e.target.checked)} />}
                                        label="Facebook"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={instagram} onChange={(e) => setInstagram(e.target.checked)} />}
                                        label="Instagram"
                                    />
                                </Box>
                                {isEditing ? (
                                    <Button variant="contained" color="primary" onClick={saveTodo}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={createTodo}>
                                        Submit
                                    </Button>
                                )}
                            </Box>
                            <Box className="cards-container">
                                {todos.map((todo) => (
                                    <Card key={todo.id} className="card" sx={{ backgroundColor: "#696969", color: "#2e2e2e" }}>
                                        <CardContent>
                                            <Typography variant="h5" component="div" sx={{ color: "#2e2e2e" }}>
                                                {todo.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {todo.date ? new Date(todo.date).toLocaleString() : "No date set"}
                                            </Typography>
                                            <Typography className="wrapped-text" variant="body2" color="text.secondary">
                                                {showFullBody[todo.id] ? todo.body : truncateBody(todo.body || "", 75)}
                                                {todo.body && todo.body.length > 75 && (
                                                    <IconButton onClick={() => setShowFullBody(prev => ({ ...prev, [todo.id]: !prev[todo.id] }))}>
                                                        {showFullBody[todo.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                    </IconButton>
                                                )}
                                            </Typography>
                                            <div className="social-logos">
                                                {todo.LinkedIn && <img src={linkedinLogo} alt="LinkedIn" className="social-logo" />}
                                                {todo.Facebook && <img src={facebookLogo} alt="Facebook" className="social-logo" />}
                                                {todo.Instagram && <img src={instagramLogo} alt="Instagram" className="social-logo" />}
                                            </div>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton color="primary" onClick={() => startEdit(todo)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => deleteTodo(todo.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                            <Button variant="outlined" color="secondary" onClick={signOut}>
                                Sign out
                            </Button>
                        </Box>
                    </Box>
                )}
            </Authenticator>
        </ThemeProvider>
    );
}

export default App;
