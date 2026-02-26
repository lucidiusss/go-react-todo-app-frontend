import Task from "./Task";
import type { Dispatch, FC, SetStateAction } from "react";
import type { TaskInterface } from "@/App";
import { Skeleton } from "./ui/skeleton";

interface TaskProps {
    tasks: TaskInterface[];
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>;
    isLoading: boolean;
}

const Tasks: FC<TaskProps> = ({ tasks, setTasks, isLoading }) => {
    return (
        <div className="flex flex-col gap-5 items-center w-full md:w-3/4 h-full overflow-y-scroll">
            {isLoading ? (
                <>
                    <Skeleton className="w-full h-14 bg-black/10 rounded-md " />
                    <Skeleton className="w-full h-14 bg-black/10 rounded-md " />
                    <Skeleton className="w-full h-14 bg-black/10 rounded-md " />
                </>
            ) : (
                <>
                    {tasks.map((t) => (
                        <Task
                            tasks={tasks}
                            setTasks={setTasks}
                            key={t.id}
                            title={t.title}
                            createdAt={t.created_at}
                            updatedAt={t.updated_at}
                            id={t.id}
                            completed={t.completed}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default Tasks;
