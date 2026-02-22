import { useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatRelative, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "./ui/button";
import { Check, Edit, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import axios from "axios";
import type { TaskInterface } from "@/App";
import { Input } from "./ui/input";
import toast from "react-hot-toast";

interface TaskProps {
    id: number;
    title: string;
    completed: boolean;
    date: Date | string;
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>;
    tasks: TaskInterface[];
}

const Task: FC<TaskProps> = ({
    id,
    title,
    date,
    completed,
    setTasks,
    tasks,
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(title);
    const [originalTitle, setOriginalTitle] = useState<string>(title);

    const API = axios.create({
        baseURL: "https://api.todo.lucidiusss.lol/api",
    });

    const formatDate = (date: string | Date) => {
        try {
            let dateObj: Date;

            if (typeof date === "string") {
                dateObj = parseISO(date);
            } else {
                dateObj = date;
            }

            return formatRelative(dateObj, dateObj, { locale: enUS });
        } catch (error) {
            console.log(error);
            return "Неверная дата";
        }
    };

    const deleteTask = async (id: number) => {
        try {
            if (isEditing === false) {
                await API.delete(`tasks/${id}`).then(() => {
                    setTasks(tasks.filter((t) => t.id !== id));
                });
                toast("✅ Task was successfully deleted!");
            } else {
                setIsEditing(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renameTask = async (id: number, title: string) => {
        try {
            if (originalTitle.trim() === inputValue.trim()) {
                console.log("task was not changed");
                setIsEditing(false);
                return;
            }

            const loadingToast = toast.loading("Renaming task...");
            await API.put(`/tasks/${id}`, {
                title: title.trim(),
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === id ? { ...t, title } : t)),
            );
            toast("Task was successfully renamed!", {
                id: loadingToast,
                icon: "✅",
                duration: 3000,
            });
            setOriginalTitle(inputValue.trim());
        } catch (error) {
            toast.dismiss();
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error;

                console.log(errorMessage);
                toast(`❌ ${errorMessage}`);
            }
        } finally {
            setIsEditing(false);
        }
    };

    const toggleTask = async (id: number) => {
        try {
            const currentTask = tasks.find((t) => t.id === id);

            if (!currentTask) {
                toast.error("🛠️ Task was not found");
                return;
            }

            // Определяем новый статус (противоположный текущему)
            const newStatus = !currentTask.completed;

            // Показываем тост в зависимости от того, что делаем
            const loadingToast = toast.loading(
                newStatus
                    ? "Doing task..."
                    : "Task is back to in-progress state...",
            );

            await API.post(`tasks/${id}/toggle`).then((res) =>
                console.log(res.data),
            );

            setTasks((tasks) =>
                tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t,
                ),
            );

            toast.success(
                newStatus ? "Task is done!" : "Task is now in progress",
                {
                    id: loadingToast,
                    icon: newStatus ? "✅ " : "↩️ ",
                    duration: 3000,
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="transition flex items-center w-full border shadow border-black/10 px-4 py-3 rounded-md">
                        <Checkbox
                            checked={completed}
                            onClick={() => toggleTask(id)}
                            className="md:h-6 md:w-6 data-[state=checked]:bg-green-500 data-[state=checked]:border-black/15"
                        />
                        <div className="w-full flex flex-col cursor-default items-center mx-6">
                            {!isEditing ? (
                                <p className="text-[18px] md:text-[20px] lg:text-[24px]">
                                    {title}
                                </p>
                            ) : (
                                <Input
                                    onKeyDown={(e) =>
                                        e.key === "Enter"
                                            ? renameTask(id, inputValue)
                                            : e.key === "Escape"
                                              ? setIsEditing(false)
                                              : ""
                                    }
                                    className="placeholder:text-gray-300 md:placeholder:text-[20px] text-[18px] placeholder:text-[18px] w-full md:text-[20px] lg:text-[24px] sm:py-3 sm:px-4 bg-gray-100 rounded-md"
                                    value={inputValue}
                                    placeholder="type a new name for this task"
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                />
                            )}
                            {!isEditing ? (
                                <TooltipContent>
                                    <p>created {formatDate(date)}</p>
                                </TooltipContent>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="ml-auto flex flex-row items-center">
                            {!isEditing ? (
                                <Button
                                    size="icon"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-transparent hover:bg-black/5 group  active:bg-black"
                                >
                                    <Edit className="text-black group-active:text-white h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            ) : (
                                <Button
                                    size="icon"
                                    onClick={() => renameTask(id, inputValue)}
                                    className="bg-transparent hover:bg-black/5 group  active:bg-black"
                                >
                                    <Check className="text-black group-active:text-white h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            )}

                            <Button
                                size="icon"
                                onClick={() => deleteTask(id)}
                                className="bg-transparent hover:bg-black/5 group  active:bg-red-500"
                            >
                                <X className="text-black group-active:text-white h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                        </div>
                    </div>
                </TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Task;
