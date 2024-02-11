
import './App.css';

import {useState, useEffect} from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000"

function App() {

    //hooks

  const [title, setTitle ] = useState("");
  const [time, setTime] = useState("");
  //"todos" vai ser usado para armazenar a lista de tarefas
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState("");


  // efeitos de carregar e mandar ao console e banco integrado do react
  useEffect(() => {
const loadData = async (e) =>{
      setLoading(true);

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data )
      .catch((err) => console.log(err));

      setLoading(false)

      setTodos(res);
};
loadData();

  },[]);
  //onde o dado enviado será repassado so json 

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const todo = {
      id:Math.random(),
      title,
      time,
      done: false,

    };
    await fetch(API + "/todos",{
      method:"POST",
      body: JSON.stringify(todo),
      headers:{
        "Content-Type": "application/json",
      },
    });


    setTodos((prevState) => [...prevState,todo]);

    //enviando o valor para a API

    console.log(todo);

    setTitle("");
    setTime("");
  
  };

  const handlerDelete = async (id) =>{

    await fetch(API + "/todos/ " + id,{
      method:"DELETE",
     
    
      });
        setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    };

    const handleEdit= async(todo) =>{
      todo.done = !todo.done;

     const data = await fetch(API + "/todos/" + todo.id,{
        method:"PUT",
        body: JSON.stringify(todo),
        headers:{
          "Content-Type": "application/json",
        },
       
     });
        setTodos((prevState) =>
         prevState.map((t) => (t.id === data.id ? data : t))
        );
      };
     
      

      //pra não ficar aparecendo outa mensagem ao recarregar a pag  um if para simular o load da pag
  if(loading){
    return <p>Carregando...</p>
  };

  return (
    <div className="App">
      <div className='todo-header'>
       <h1>Lista ToDo :) </h1>
      </div>
      <div className='form-todo'>
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>

          <div className='form-control'>
            <label htmlFor='title'>O que você vai fazer em ?</label>
            <input type='text' name='title' placeholder='Título da tarefa' onChange={(e) => setTitle(e.target.value)}
            value={title || ""}
            required
            />
         </div>

            <div className='form-control'>
            <label htmlFor='time'>Duração:</label>
            <input type='text' name='time' placeholder='Tempo estimado (em horas)' onChange={(e) => setTime(e.target.value)}
            value={time || "" }
            required
            />

         </div>
 

        <input type='submit' value="Criar tarefa!"/>
     </form>

      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas</h2>
        {todos.length === 0 && <p>Não há tarefas no momento!</p>}
        {todos.map((todo) => (
          <div className="todos" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}> {todo.title}</h3>
            <p>Duração:{todo.time} Horas</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>

                 {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}

              </span>
              <BsTrash onClick={() => handlerDelete(todo.id)} />
              </div>

            </div>
        ))}

      </div>
     

 
    </div>
  );
        };

export default App;
