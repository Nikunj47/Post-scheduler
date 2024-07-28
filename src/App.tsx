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

        client.models.Todo.create({ title, body, date: selectedDateTime.toISOString() });
        setTitle("");
        setBody("");
        setDate("");
        setTime("");
    }

    function startEdit(todo: Schema["Todo"]["type"]) {
        setTitle(todo.title ?? "");
        setBody(todo.body ?? "");
        setDate(todo.date ? new Date(todo.date).toISOString().split('T')[0] : "");
        setTime(todo.date ? new Date(todo.date).toISOString().split('T')[1].slice(0, 5) : "");
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
        });
        setTitle("");
        setBody("");
        setDate("");
        setTime("");
        setIsEditing(false);
        setCurrentTodoId(null);
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

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
                                <p>{todo.body}</p>
                                <p>{todo.date ? new Date(todo.date).toLocaleString() : "No date set"}</p>
                                <button onClick={() => startEdit(todo)}>Edit</button>
                                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </li>
                        ))} //hi
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
