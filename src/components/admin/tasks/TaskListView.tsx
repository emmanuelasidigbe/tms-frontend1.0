"use client";

import { useState } from "react";
import TaskTableHeader from "@/components/TaskTableHeader";
import TaskTableRow from "./TaskTableRow";
import TaskTablePagination from "@/components/TaskTablePagination";
import { Task } from "@/interfaces/tasks";
import { TbTargetArrow } from "react-icons/tb";
import { BsListNested } from "react-icons/bs";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { GrStatusDisabled } from "react-icons/gr";
import { IoPersonOutline } from "react-icons/io5";
import { GrAction } from "react-icons/gr";

export default function TaskListView({ tasks }: { tasks: Task[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const numTasks = tasks.length;

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-sm border text-sm">
      <TaskTableHeader numTasks={numTasks} />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs text-gray-500">
              <th className="p-2 sm:p-3 text-left font-medium">
                <div className="flex items-center space-x-2 text-gray-500">
                  <TbTargetArrow className="text-base" />
                  <span className="text-xs">Task Name</span>
                </div>
              </th>
              <th className="p-2 sm:p-3 text-left font-medium hidden sm:table-cell">
                <div className="flex items-center space-x-2 text-gray-500">
                  <BsListNested className="text-base" />
                  <span className="text-xs">Description</span>
                </div>
              </th>
              <th className="p-2 sm:p-3 text-left font-medium hidden md:table-cell">
                <div className="flex items-center space-x-2 text-gray-500">
                  <IoCalendarNumberSharp className="text-base" />
                  <span className="text-xs">Deadline</span>
                </div>
              </th>
              <th className="p-2 sm:p-3 text-left font-medium table-cell">
                <div className="flex items-center space-x-2 text-gray-500">
                  <GrStatusDisabled className="text-sm" />
                  <span className="text-xs">Status</span>
                </div>
              </th>
              <th className="p-2 sm:p-3 text-left font-medium table-cell">
                <div className="flex items-center space-x-2 text-gray-500">
                  <IoPersonOutline className="text-sm" />
                  <span className="text-xs">Assignee</span>
                </div>
              </th>
              <th className="p-2 sm:p-3 text-right font-medium">
                <span className="sr-only">Actions</span>
                <div className="flex items-center justify-end space-x-2 text-gray-500">
                  <GrAction className="text-sm" />
                  <span className="text-xs">Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <TaskTableRow key={task.taskId} task={task} />
            ))}
          </tbody>
        </table>
      </div>

      <TaskTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
