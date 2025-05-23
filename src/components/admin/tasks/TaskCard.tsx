import { FaRegCommentDots } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiEditFill } from "react-icons/ri";
import { Task } from "@/interfaces/tasks";
import EditTaskDialog from "@/components/admin/tasks/EditTaskDialog";
import { RiDeleteBin4Fill } from "react-icons/ri";
import formatDate from "@/utils/formatDate";
import getInitials from "@/utils/getInitials";
import { toast } from "sonner";
import ReOpenTaskDialog from "./ReopenTaskDialog";
import { VscIssueReopened } from "react-icons/vsc";
import { mutate } from "swr";

export default function TaskCard({ task }: Readonly<{ task: Task }>) {
  let statusColor;

  switch (task.status) {
    case "open":
      statusColor = "hover:bg-[#5153FF] ";
      break;
    case "completed":
      statusColor = "hover:bg-[#2FBA56]";
      break;
    case "overdue":
      statusColor = "hover:bg-[#d32f2f]";
  }

  const handleDeleteTask = async () => {
    const confirmation = window.confirm(
      `Are you sure you want to delete task "${task.name}"?`
    );
    if (!confirmation) {
      return;
    }

    try {
      await fetch(`/api/tasks`, {
        method: "DELETE",
        body: JSON.stringify({ taskId: task.taskId }),
      });

      mutate("/api/tasks"); // Revalidate the tasks list
      toast.success(`Task "${task.name}" deleted successfully`);
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error(`Failed to delete task "${task.name}"`);
    }
  };

  return (
    <div
      className={`min-w-96 bg-white group ${statusColor} transition-all p-5 rounded-[5px] space-y-4 border border-[#EFEFEF]`}
    >
      <div className="space-y-3">
        <div className="flex items-center space-x-2 justify-between">
          <h3 className="font-medium text-sm capitalize text-[#232526] group-hover:text-white">
            {task.name}
          </h3>
          <div className="flex gap-1">
            <ReOpenTaskDialog task={task}>
              <VscIssueReopened
                className={`text-[#7A7B88] text-xl cursor-pointer group-hover:text-white ${
                  task.status === "open" ? "hidden" : ""
                }`}
              />
            </ReOpenTaskDialog>
            <EditTaskDialog task={task}>
              <RiEditFill
                className={`text-[#7A7B88] text-xl cursor-pointer group-hover:text-white ${
                  task.status === "open" ? "" : "hidden"
                }`}
              />
            </EditTaskDialog>

            <RiDeleteBin4Fill
              onClick={handleDeleteTask}
              className="text-[#7A7B88] text-xl cursor-pointer group-hover:text-white"
            />
          </div>
        </div>

        <p className="text-sm text-[#7A7B88] group-hover:text-white">
          {task.description}
        </p>
      </div>
      <div>
        <span className="text-sm font-medium text-[#7A7B88] group-hover:text-white">
          {formatDate(task.deadline)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={`/images/`}
              alt={task.taskOwner.name}
              className={`bg-[${statusColor}] group-hover:bg-white rounded-full`}
            />
            <AvatarFallback>{getInitials(task.taskOwner.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex items-center space-x-1 font-medium text-[#7A7B88] group-hover:text-white">
            <FaRegCommentDots />
            <span>{task.userComment === "" ? "" : "1"} </span>
          </div>
        </div>
      </div>
    </div>
  );
}
