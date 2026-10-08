"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import { TodoList } from "./todo-list";
import { ProgressGauge } from "./progress-gauge";
import { CyclingWordsHero } from "./cycling-words-hero";

export function ExampleCanvas() {
  const { agent } = useAgent();
  const todos = agent.state?.todos || [];
  const completed = todos.filter((t) => t.status === "completed").length;

  return (
    <div className="h-full overflow-y-auto bg-[--background]">
      <div className="max-w-4xl mx-auto px-8 py-10 h-full">
        <CyclingWordsHero />
        <ProgressGauge total={todos.length} completed={completed} />
        <TodoList
          todos={todos}
          onUpdate={(updatedTodos) => agent.setState({ todos: updatedTodos })}
          isAgentRunning={agent.isRunning}
        />
      </div>
    </div>
  );
}
