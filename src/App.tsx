import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [title, setTitle] = useState(""); // New line
    const [body, setBody] = useState(""); // New line
    const [isEditing, setIsEditing] = useState(false); // New line
    const [currentTodoId, setCurrentTodoId] = useState<string | null>(null); // New line

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
        setTitle(todo.title); // New line
        setBody(todo.body); // New line
        setCurrentTodoId(todo.id); // New line
        setIsEditing(true); // New line
    }

    function saveTodo() { // New function
        if (currentTodoId && title && body) { // New line
            client.models.Todo.update({ // New line
                id: currentTodoId, // New line
                title, // New line
                body, // New line
            });
            setTitle(""); // New line
            setBody(""); // New line
            setIsEditing(false); // New line
            setCurrentTodoId(null); // New line
        } else {
            alert("Both title and body are required"); // New line
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
                            value={title} // New line
                            onChange={(e) => setTitle(e.target.value)} // New line
                        />
                        <input
                            type="text"
                            placeholder="Todo body"
                            value={body} // New line
                            onChange={(e) => setBody(e.target.value)} // New line
                        />
                        {isEditing ? ( // New line
                            <button onClick={saveTodo}>Save</button> // New line
                        ) : (
                            <button onClick={createTodo}>Submit</button>
                        )}
                    </div>
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id}>
                                <h2>{todo.title}</h2> // Modified line
                                <p>{todo.body}</p> // Modified line
                                <button onClick={() => startEdit(todo)}>Edit</button> // New line
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
