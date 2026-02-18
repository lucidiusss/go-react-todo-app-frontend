import Tasks from "./components/Tasks";
import { Input } from "@/components/ui/input";
import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export interface TaskInterface {
    id: number;
    title: string;
    completed: boolean;
    created_at: Date;
}

function App() {
    const [tasks, setTasks] = useState<TaskInterface[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const API = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    useEffect(() => {
        API.get("tasks").then((res) => {
            setTasks(res.data);
        });
    }, []);

    const createTask = async (title: string) => {
        try {
            await API.post("/tasks", {
                title: title,
            }).then((res) => {
                setTasks([...tasks, res.data]);
            });
            toast("✅ Задача создана!");
        } catch (error) {
            console.log(error);
            toast("❌ Не удалось создать задачу!");
        } finally {
            setInputValue("");
        }
    };

    return (
        <>
            <div className="max-w-7xl w-full md:my-10 md:w-2/3 md:mx-auto h-full flex flex-col items-center gap-10 p-3 md:p-6 rounded-xl shadow-xs bg-slate-50">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        all tasks
                    </h1>
                </div>
                <div className="w-full md:w-2/3 flex flex-row items-center gap-5">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="add new task"
                        className="placeholder:text-gray-300 placeholder:text-2xl text-[18px] placeholder:text-[18px]  md:text-2xl sm:py-3 sm:px-4 bg-gray-100 rounded-md"
                    />
                    {inputValue.length > 0 ? (
                        <Button
                            onClick={() => createTask(inputValue)}
                            className="bg-gray-100 shadow border group  active:bg-green-500 hover:bg-gray-200"
                        >
                            <Plus className="text-black group-active:text-white" />
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <Tasks tasks={tasks} setTasks={setTasks} />
            </div>
        </>
    );
}

export default App;
