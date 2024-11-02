import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState(""); // Estado para la tarea nueva

  // Obtener los todos desde la API
  function getTodos() {
    fetch("https://playground.4geeks.com/todo/users/emiliano_ferreiraa")
      .then((resp) => {
        console.log(resp.status); // Puedes revisar el estado de la respuesta aquí
        return resp.json();
      })
      .then((data) => {
        console.log(data); // Ver los datos completos de la respuesta
        setTodos(data.todos); // Actualiza el estado con los datos obtenidos
      })
      .catch((error) => {
        console.error("Error al obtener los datos: ", error); // Mejor manejo de errores
      });
  }

  // Crear un nuevo todo (POST request)
  function postTodo(task) {
    const newTask = {
      label: task,
      is_done: false,
    };

    fetch("https://playground.4geeks.com/todo/todos/emiliano_ferreiraa", {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data); // Ver los datos de la nueva tarea
        getTodos(); // Recargar los todos después de agregar una nueva tarea
        setNewTask(""); // Limpiar el campo de entrada
      })
      .catch((error) => {
        console.error("Error al agregar el todo: ", error);
      });
  }

  // Eliminar una tarea por ID (DELETE request)
  function deleteTodo(id) {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("No se pudo eliminar la tarea");
        }
        // Si la respuesta tiene contenido, lo convertimos a JSON, de lo contrario, retornamos un objeto vacío
        return resp.status === 204 ? {} : resp.json();
      })
      .then((data) => {
        console.log("Respuesta de la eliminación:", data); // Ver la respuesta de la eliminación
        // Filtrar la tarea eliminada de la lista local
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar el todo: ", error);
      });
  }

  // Manejar el evento de presionar Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newTask.trim() !== "") {
      // Verifica si la tecla es Enter y si la tarea no está vacía
      postTodo(newTask);
    }
  };

  // Usamos useEffect para mostrar los todos cuando el estado cambia
  useEffect(() => {
    console.log(todos); // Este console.log se ejecutará cada vez que todos cambien
  }, [todos]);

  return (
    <div className="container d-flex flex-column align-items-center border p-2 mt-4">
      <div>
        <div>
          <h2 className="text-center">To do list:</h2>
          <input
            type="text"
            id="tareaCreada"
            placeholder="Crear tarea"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {todos.length === 0 ? (
          <p>Carga las tareas</p>
        ) : (
          todos.map((todo) => {
            return (
              <div
                className="d-flex flex-row my-2 border justify-content-between"
                key={todo.id}
              >
                <div className="pb-0">
                  <h5>- {todo.label}</h5>
                </div>
                <div className="d-flex">
                  <button
                    className="btn h-0 p-0 m-0 px-1"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div>
        <button
          className="btn btn-primary me-2"
          onClick={() => {
            if (newTask.trim().length > 0) {
              postTodo(newTask);
            } else {
              return alert("No es posible crear tareas vacías");
            }
          }}
        >
          Post To Do's
        </button>
        <button className="btn btn-outline-success" onClick={getTodos}>
          Get To Do's
        </button>
      </div>
    </div>
  );
}

export default App;
