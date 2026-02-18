import { useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
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

    const API = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    const formatDate = (date: string | Date) => {
        try {
            let dateObj: Date;

            if (typeof date === "string") {
                dateObj = parseISO(date);
            } else {
                dateObj = date;
            }

            return format(dateObj, "dd.MM.yyyy HH:mm", { locale: ru });
        } catch (error) {
            console.log(error);
            return "Неверная дата";
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await API.delete(`tasks/${id}`).then(() => {
                setTasks(tasks.filter((t) => t.id !== id));
            });
        } catch (error) {
            console.log(error);
        } finally {
            toast("✅ Задача успешно удалена!");
        }
    };

    const renameTask = async (id: number, title: string) => {
        try {
            await API.put(`/tasks/${id}`, {
                title,
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === id ? { ...t, title } : t)),
            );
        } catch (error) {
            console.log(error);
        } finally {
            setIsEditing(false);
        }
    };

    const toggleTask = async (id: number) => {
        try {
            const currentTask = tasks.find((t) => t.id === id);

            if (!currentTask) {
                toast.error("Задача не найдена");
                return;
            }

            // Определяем новый статус (противоположный текущему)
            const newStatus = !currentTask.completed;

            // Показываем тост в зависимости от того, что делаем
            const loadingToast = toast.loading(
                newStatus ? "Выполняем задачу..." : "Возвращаем задачу...",
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
                newStatus
                    ? "🎉 Задача выполнена!"
                    : "Задача возвращена в работу",
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
                        <div className="w-full flex flex-col cursor-default items-center">
                            {!isEditing ? (
                                <p className="text-[18px] md:text-2xl mx-6">
                                    {title}
                                </p>
                            ) : (
                                <Input
                                    className="mx-6 placeholder:text-gray-300 placeholder:text-2xl text-[18px] placeholder:text-[18px] md:w-2/3 md:text-2xl sm:py-3 sm:px-4 bg-gray-100 rounded-md"
                                    value={inputValue}
                                    placeholder="type a new name for this task"
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                />
                            )}
                            {!isEditing ? (
                                <TooltipContent>
                                    <p>Создано: {formatDate(date)}</p>
                                </TooltipContent>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="ml-auto flex flex-row items-center">
                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-transparent hover:bg-black/5 group  active:bg-black"
                                >
                                    <Edit className="text-black group-active:text-white h-4 w-4 md:h-6 md:w-6" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => renameTask(id, inputValue)}
                                    className="bg-transparent hover:bg-black/5 group  active:bg-black"
                                >
                                    <Check className="text-black group-active:text-white h-4 w-4 md:h-6 md:w-6" />
                                </Button>
                            )}

                            <Button
                                onClick={() => deleteTask(id)}
                                className="bg-transparent hover:bg-black/5 group  active:bg-red-500"
                            >
                                <X className="text-black group-active:text-white h-4 w-4 md:h-6 md:w-6" />
                            </Button>
                        </div>
                    </div>
                </TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Task;
