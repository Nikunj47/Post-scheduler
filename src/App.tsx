import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [title, setTitle] = useState<string>(""); // Added type annotation
    const [body, setBody] = useState<string>(""); // Added type annotation
    const [isEditing, setIsEditing] = useState<boolean>(false); // Added type annotation
    const [currentTodoId, setCurrentTodoId] = useState<string | null>(null); // Added type annotation

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        if (title && body) { // Modified line
            client.models.Todo.create({ title, body }); // Modified line
            setTitle(""); // New line
            setBody(""); // New line
        } else {
            alert("Both title and body are required"); // New line
        }
    }

    function startEdit(todo: Schema["Todo"]["type"]) { // New function
        setTitle(todo.title ?? ""); // Fixed type issue
        setBody(todo.body ?? ""); // Fixed type issue
        setCurrentTodoId(todo.id);
        setIsEditing(true);
    }

    function saveTodo() {
        if (currentTodoId && title && body) {
            client.models.Todo.update({
                id: currentTodoId,
                title,
                body,
            });
            setTitle("");
            setBody("");
            setIsEditing(false);
            setCurrentTodoId(null);
        } else {
            alert("Both title and body are required");
        }
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

    return (
        <Authenticator>
            {({ signOut }) => (
                <main>
                    <h1>My todos</h1>
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
                                <button onClick={() => startEdit(todo)}>Edit</button>
                                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        🥳 App successfully hosted. Try creating a new todo.
                        <br />
                        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                            Review next step of this tutorial.
                        </a>
                    </div>
                    <button onClick={signOut}>Sign out</button>
                </main>
            )}
        </Authenticator>
    );
}

export default App;
