import { $AppKey } from "../util/keySignal.ts";

// 密钥输入组件
export default function KeyInput({ field, value, onSave }: {
  field: { key: keyof $AppKey; type?: string };
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
      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder={`请输入${field.label}`}
    />
  );
}
