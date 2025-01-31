import { $AppKey } from "../util/keySignal.ts";

// 密钥输入组件
export default function KeyInput({ field, value, onSave }: {
  field: { key: keyof $AppKey; type?: string, label: string };
  value: string;
  onSave: (key: keyof $AppKey, value: string) => void;
}) {
  return (
    <input
      type={field.type || "text"}
      value={value}
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        onSave(field.key, target.value);
      }}
      class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        bg-white dark:bg-gray-800 
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        disabled:bg-gray-100 dark:disabled:bg-gray-900
        disabled:cursor-not-allowed
        transition-colors duration-200"
      placeholder={`请输入${field.label}`}
    />
  );
}
