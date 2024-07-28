import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        if (title && body) {
            client.models.Todo.create({ title, body });
            setTitle("");
            setBody("");
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
                        <button onClick={createTodo}>+ new</button>
                    </div>
                    <ul>
                        {todos.map((todo) => (
                            <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
                                <h2>{todo.title}</h2>
                                <p>{todo.body}</p>
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
