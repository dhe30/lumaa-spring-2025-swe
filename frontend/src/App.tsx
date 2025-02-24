import { useContext, useEffect, useState } from 'react'
import './App.css'
import { AuthContext } from './context/AuthContext'
import api from './api/api';
import Task from './components/Task';
import { AxiosError } from 'axios';

interface Tasks {
  id?: string,
  title?: string,
  description?: string,
  iscomplete?: boolean,
}

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string>("")
  const [tasks, setTasks] = useState<Tasks[]>();
  const auth = useContext(AuthContext);

  useEffect(() => {
    async function getTasks() {
      try {
        const res = await api.get("/tasks");
        setTasks([...res.data])
      } catch(error) {
        if (error instanceof AxiosError) {
          auth?.logout();
        } else {
          console.log("unexpected error occured")
        }
      }
    }
    if (auth?.user) {
      getTasks()
    }
  }, [auth, auth?.user]);

  async function deleter(id = "") {
    if (id != "new") {
      await api.delete(`/tasks/${id}`)
      setTasks(tasks?.filter(task => {
        return task.id != id
      }))
    } else {
      setTasks(tasks?.slice(1))
    }
  }

  function setNewTask(task: Tasks) {
      setTasks(tasks => {
        if (tasks) {
          const newTasks = [...tasks]
          newTasks[0] = task;
          return newTasks
        } else {
          return tasks
        }
      })
  }

  function addNewTask() {
    if (tasks?.length) {
      if (tasks[0].id != "new") {
        setTasks([{id: "new"},...tasks]);
      }
    } else {
      setTasks([{id: "new"}])
    }
  }

  async function handleRegister(formData: FormData) {
    setError("");
    if (formData.get("password") != formData.get("re-password")) {
      setError("passwords are not the same");
    } else if ((formData.get("password") as string).length < 8) {
      setError("password must be more than 8 characters");
    } else {
      const res = await auth?.register(formData.get("username") as string, formData.get("password") as string);
      if (res?.success) {
        console.log("success");
      } else {
        setError("user already exists");
      }
    }
  }

  async function handleLogin(formData: FormData) {
    setError("");
    const res = await auth?.login(formData.get("username") as string, formData.get("password") as string);
    if (res?.success) {
      console.log("success")
    } else {
      setError("username or password invalid");
    }
  }
  return (
    <>
    { auth?.user?
      <div>
        <h1>Welcome, {auth.user}</h1>
        <button onClick={auth.logout}>Logout</button>
        <button onClick={addNewTask}>add task please!</button>
        {tasks && 
          tasks.map((task)=> { return (
            <Task 
              key={(task.id || "") + task.title + task.description + task.iscomplete}
              edit={task.id === "new" ? true: false} 
              title={task.title} 
              description={task.description} 
              isComplete={task.iscomplete} 
              id={task.id}
              setNewTask={setNewTask}
              deleter={deleter}>
            </Task>
          )})
        }
      </div>
      :
      <div>
        <form action={isLogin? handleLogin : handleRegister} className='formLogin'>
          {error && <div className='error'>{error}</div>}
          <label htmlFor="username">login</label>
          <input id='username' name='username' type='text' required></input>
          <label htmlFor="password">register</label>
          <input id='password' name='password'type='password' required></input>
          {!isLogin && 
            <>
              <label htmlFor="re-password">retype password</label>
              <input id='re-password' name='re-password' type='password' required></input>
            </>
          }
          <button type='submit'>{isLogin? "login" : "register"}</button>
          <a onClick={() => setIsLogin(!isLogin)}>{isLogin? "Register for an account" : "Already have an account? Login"}</a>
        </form>
      </div>
    }
    </>
  )
}

export default App
