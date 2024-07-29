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
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const client = generateClient<Schema>();

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
            Instagram: instagram
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
            Instagram: instagram
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

    return (
        <Authenticator>
            {({ signOut }) => (
                <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
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
                    <Box>
                        {todos.map((todo) => (
                            <Card key={todo.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {todo.title}
                                    </Typography>
                                    <Typography className="wrapped-text" variant="body2" color="text.secondary">
                                        {showFullBody[todo.id] ? todo.body : truncateBody(todo.body || "", 200)}
                                        {todo.body && todo.body.length > 200 && (
                                            <IconButton onClick={() => setShowFullBody(prev => ({ ...prev, [todo.id]: !prev[todo.id] }))}>
                                                {showFullBody[todo.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {todo.date ? new Date(todo.date).toLocaleString() : "No date set"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {todo.LinkedIn && "LinkedIn "}
                                        {todo.Facebook && "Facebook "}
                                        {todo.Instagram && "Instagram "}
                                    </Typography>
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
            )}
        </Authenticator>
    );
}

export default App;
