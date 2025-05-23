"use client";

import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FormGroup from "@/components/FormGroup";
import DatePicker from "./DatePicker";
import axios from "axios";
import { mutate } from "swr";

const inputClasses =
  "rounded-[2px] col-span-3 shadow-none px-3 py-2 text-[#232526] focus-visible:border-0 focus-visible:ring-[#5153FF] focus-visible:ring-2";
const buttonClasses =
  "bg-[#5153FF] hover:bg-[#4649db] rounded-[2px] cursor-pointer";

export default function AddTaskForm({
  changeModalState,
}: Readonly<{ changeModalState: () => void }>) {
  const { users } = useUserContext();

  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!name || !deadline || !user || !description) {
      setErrorMessage("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const taskData = {
      userId: user,
      name,
      description,
      deadline,
    };

    try {
      await axios.post("/api/tasks", taskData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      mutate("/api/tasks"); // Revalidate the tasks list
    } catch (error) {
      console.error("Error creating task:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      changeModalState();
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      <FormGroup label="Task title" htmlFor="name">
        <Input
          id="name"
          className={inputClasses}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Deadline" htmlFor="deadline">
        <DatePicker deadline={deadline} setDeadline={setDeadline} />
      </FormGroup>
      <FormGroup label="Assign to" htmlFor="responsibility">
        <Select value={user} onValueChange={setUser} defaultValue="">
          <SelectTrigger className="w-full shadow-none">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {users?.map((user) => (
                <SelectItem key={user.userId} value={user.userId}>
                  {user.name}
                </SelectItem>
              ))}
              `
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup label="Description" htmlFor="description">
        <Textarea
          placeholder="Provide detailed instructions for this task"
          className={inputClasses}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>
      <Button className={buttonClasses} type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Create Task"}
      </Button>
    </form>
  );
}
