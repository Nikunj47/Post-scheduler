import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

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
                <main>
                    <h1>Posts</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Todo title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Todo body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <input
                            type="date"
                            placeholder="Todo date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <input
                            type="time"
                            placeholder="Todo time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        <div>
                            <input
                                type="checkbox"
                                checked={linkedIn}
                                onChange={(e) => setLinkedIn(e.target.checked)}
                            />
                            <label>LinkedIn</label>
                            <input
                                type="checkbox"
                                checked={facebook}
                                onChange={(e) => setFacebook(e.target.checked)}
                            />
                            <label>Facebook</label>
                            <input
                                type="checkbox"
                                checked={instagram}
                                onChange={(e) => setInstagram(e.target.checked)}
                            />
                            <label>Instagram</label>
                        </div>
                        {isEditing ? (
                            <button onClick={saveTodo}>Save</button>
                        ) : (
                            <button onClick={createTodo}>Submit</button>
                        )}
                    </div>
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id}>
                                <h2>{todo.title}</h2>
                                <p>
                                    {showFullBody[todo.id] ? todo.body : truncateBody(todo.body || "", 200)}
                                    {todo.body && todo.body.length > 200 && (
                                        <button onClick={() => setShowFullBody(prev => ({ ...prev, [todo.id]: !prev[todo.id] }))}>
                                            {showFullBody[todo.id] ? "Show Less" : "Show More"}
                                        </button>
                                    )}
                                </p>
                                <p>{todo.date ? new Date(todo.date).toLocaleString() : "No date set"}</p>
                                <p>
                                    {todo.LinkedIn && "LinkedIn "}
                                    {todo.Facebook && "Facebook "}
                                    {todo.Instagram && "Instagram "}
                                </p>
                                <button onClick={() => startEdit(todo)}>Edit</button>
                                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        🥳 App successfully hosted. Try creating a post.
                        <br />
                    </div>
                    <button onClick={signOut}>Sign out</button>
                </main>
            )}
        </Authenticator>
    );
}

export default App;
