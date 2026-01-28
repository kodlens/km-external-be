import { useState } from 'react'

export default function OllamaChat() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const sendPrompt = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setResponse('')

    const res = await fetch('http://192.168.40.48:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    })

    if (!res.body) {
      setLoading(false)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(Boolean)

      for (const line of lines) {
        const json = JSON.parse(line)

        if (json.message?.content) {
          setResponse((prev) => prev + json.message.content)
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Ollama Chat (Streaming)</h1>

      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={sendPrompt}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-black text-white rounded"
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>

      {response && (
        <pre className="mt-4 p-3 bg-gray-100 rounded whitespace-pre-wrap">
          {response}
        </pre>
      )}
    </div>
  )
}
