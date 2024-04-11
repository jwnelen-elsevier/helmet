import { Select, SelectItem } from "@nextui-org/react";

const options = [
  {
    label: "Q&A",
    value: "q_a",
  },
  {
    label: "Classification",
    value: "classification",
  },
  {
    label: "Text Generation",
    value: "text_generation",
  },
  {
    label: "Other",
    value: "other",
  },
];

export default function TaskSelector({ val, onChangeTask }) {
  return (
    <div className="flex w-full">
      <Select
        items={options}
        label="Task"
        labelPlacement="outside"
        selectedKeys={[val]}
        placeholder="Select Task"
        onChange={(e) => onChangeTask(e.target.value)}
      >
        {options.map((option) => (
          <SelectItem key={option.value}>{option.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
