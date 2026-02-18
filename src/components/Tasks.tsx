import Task from "./Task";
import type { Dispatch, FC, SetStateAction } from "react";
import type { TaskInterface } from "@/App";

interface TaskProps {
    tasks: TaskInterface[];
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>;
}

const Tasks: FC<TaskProps> = ({ tasks, setTasks }) => {
    return (
        <div className="flex flex-col  gap-5 items-center w-full md:w-2/3">
            {tasks.map((t) => (
                <Task
                    tasks={tasks}
                    setTasks={setTasks}
                    key={t.id}
                    title={t.title}
                    date={t.created_at}
                    id={t.id}
                    completed={t.completed}
                />
            ))}
        </div>
    );
};

export default Tasks;
