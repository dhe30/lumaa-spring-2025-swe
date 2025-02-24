import React, { useState} from "react"
import api from "../api/api"
import { AxiosError } from "axios";

interface Task {
  id?: string,
  title?: string,
  description?: string,
  isComplete?: boolean,
}


interface TaskProps extends Task {
    edit: boolean,
    deleter: (id: string | undefined) => Promise<void>,
    setNewTask: (task: Task) => void
}

export default function Task({ id, title, description, isComplete = false, edit, deleter, setNewTask}: TaskProps) {
    const [isChecked, setIsChecked] = useState<boolean>(isComplete);
    const [isEdit, setIsEdit] = useState(edit)
    const [task, setTask] = useState<Task>({ id, title, description, isComplete })

    async function updateTask({id, title, description, isComplete}: Task) {
        const res = await api.put(`/tasks/${id}`, {title , description, isComplete});
        setTask(res.data)
        console.log(res.data)
        setIsEdit(false);
    }

    async function handleUpdateTask(formData: FormData) {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        await updateTask({id, title, description, isComplete: task.isComplete})
    }

    async function addTask(formData: FormData) {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        try {
            const res = await api.post("/tasks", {title , description, isComplete: isChecked});
            setTask(res.data);
            
            setNewTask(res.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data?.message || "login failed")
            } else {
                console.log("unexpected error occured")
            }
        }
        setIsEdit(false);
    }

    return (
        <div className="task" style={task.isComplete? {backgroundColor: "#bce6c7"} : {}}>
            {isEdit?
                <form action={task.id === "new" ? addTask: handleUpdateTask}>
                    <label htmlFor="checkbox">done</label>
                    <input id="checkbox" type="checkbox" value="done" name="isComplete" checked={isChecked} onChange={() => setIsChecked(!isChecked)}></input>
                    <label htmlFor="title">title</label>
                    <input id="title" type="text" required name="title" defaultValue={task.title}></input>
                    <label htmlFor="description">description</label>
                    <input id="description" type="text" name="description" defaultValue={task.description}></input>
                    <button>save</button>
                </form>
                :
                <>                    
                    <input id="checkbox-nonedit" value="done" type="checkbox" name="completed" checked={task.isComplete} onChange={() => updateTask({...task, isComplete: !task.isComplete})}></input>
                    <label htmlFor="checkbox-nonedit">done</label>
                    <h1>{task.title}</h1> 
                    <p>{task.description}</p>
                </>
            }
            {!isEdit && <button onClick={() => setIsEdit(!isEdit)}>edit</button>}
            <button onClick={() => deleter(task.id)}>delete</button>
        </div>
    )
}