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
import { Spinner } from "./ui/spinner";

interface TaskProps {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>;
    tasks: TaskInterface[];
}

const Task: FC<TaskProps> = ({
    id,
    title,
    createdAt,
    updatedAt,
    completed,
    setTasks,
    tasks,
}) => {
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(title);
    const [originalTitle, setOriginalTitle] = useState<string>(title);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
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

            return formatRelative(dateObj, dateObj, { locale: enUS });
        } catch (error) {
            console.log(error);
            return "Неверная дата";
        }
    };

    const updated = formatDate(updatedAt);
    const created = formatDate(createdAt);

    const deleteTask = async (id: number) => {
        try {
            setIsDeleting(true);
            if (isRenaming === false) {
                await API.delete(`tasks/${id}`).then(() => {
                    setTasks(tasks.filter((t) => t.id !== id));
                });
                toast("✅ Task was successfully deleted!");
                setIsDeleting(false);
            } else {
                setIsDeleting(false);
            }
        } catch (error) {
            toast.dismiss();
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error;

                console.log(errorMessage);
                toast(`❌ ${errorMessage}`);
            }
        }
    };

    const renameTask = async (id: number, title: string) => {
        try {
            if (originalTitle.trim() === inputValue.trim()) {
                setIsRenaming(false);
                return;
            } else if (inputValue.trim() == "") {
                toast.dismiss();
                toast(`❌ Title cannot be empty`);
                setInputValue(originalTitle.trim());
                return;
            }
            setIsEditing(true);
            const loadingToast = toast.loading("Renaming task...");
            await API.put(`/tasks/${id}`, {
                title: inputValue.trim(),
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
                const errorMessage = error.response?.data.message;

                toast(`❌ ${errorMessage}`);
                setInputValue(originalTitle.trim());
            }
        } finally {
            setIsRenaming(false);
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

            const newStatus = !currentTask.completed;

            const loadingToast = toast.loading(
                newStatus
                    ? "Doing task..."
                    : "Task is back to in-progress state...",
            );

            await API.put(`tasks/${id}`, {
                completed: !completed,
            });
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
            toast.dismiss();
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error;

                console.log(errorMessage);
                toast(`❌ ${errorMessage}`);
            }
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
                            {!isRenaming ? (
                                <p className="text-[18px] md:text-[20px] lg:text-[24px]">
                                    {title}
                                </p>
                            ) : (
                                <Input
                                    disabled={isEditing}
                                    onKeyDown={(e) =>
                                        e.key === "Enter"
                                            ? renameTask(id, inputValue)
                                            : e.key === "Escape"
                                              ? setIsRenaming(false)
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
                            {!isRenaming ? (
                                <TooltipContent>
                                    <p>
                                        {updated == created
                                            ? `created ${created}`
                                            : `updated ${updated}`}
                                    </p>
                                </TooltipContent>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="ml-auto flex flex-row items-center">
                            {!isRenaming ? (
                                <Button
                                    size="icon"
                                    onClick={() => setIsRenaming(!isRenaming)}
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
                                    {isEditing ? (
                                        <Spinner className="text-black group-active:text-white" />
                                    ) : (
                                        <Check className="text-black group-active:text-white h-4 w-4 md:h-5 md:w-5" />
                                    )}
                                </Button>
                            )}

                            <Button
                                size="icon"
                                disabled={isDeleting}
                                onClick={() => deleteTask(id)}
                                className="bg-transparent hover:bg-black/5 group  active:bg-red-500"
                            >
                                {isDeleting ? (
                                    <Spinner className="text-black group-active:text-white" />
                                ) : (
                                    <X className="text-black group-active:text-white h-4 w-4 md:h-5 md:w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Task;
