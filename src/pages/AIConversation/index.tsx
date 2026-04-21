import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useState } from 'react';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

const AIConversation = memo(function AIConversation() {
  const [input, setInput] = useState('');
  const [list, setList] = useState<Msg[]>([
    { role: 'ai', text: '你好，我是 AI 养宠顾问，可以问我喂养和护理问题。' },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setList((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'ai', text: '建议先观察 24 小时，如有持续异常请尽快就医。' },
    ]);
    setInput('');
  };

  return (
    <BasicLayout navOptions={{ navTitle: 'AI养宠顾问', needBack: true }}>
      <View className="px-8 pt-28 pb-10 flex flex-col gap-3">
        {list.map((msg, idx) => (
          <View key={idx} className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-500' : 'bg-white'} shadow-sm`}>
            <Text className={msg.role === 'user' ? 'text-white' : ''}>{msg.text}</Text>
          </View>
        ))}

        <Input className="p-3 bg-gray-50 rounded-xl" value={input} onInput={(e) => setInput(e.detail.value)} placeholder="输入你的问题" />
        <View className="p-3 rounded-xl bg-blue-500" onClick={send}><Text className="text-white text-center">发送</Text></View>
      </View>
    </BasicLayout>
  );
});

export default AIConversation;
