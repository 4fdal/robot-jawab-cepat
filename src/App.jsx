import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect, useState } from 'react'
import { Form, Input } from 'antd'

import './App.css'
import config from '../default.json'


function App() {


  const [visible, setVisible] = useState(null)
  const [instruction, setInstruction] = useState(null)
  const [cookie, setCookie] = useState(null)

  useEffect(() => {
    chrome.storage.sync.get(['visible', 'instruction', 'cookie'], (result) => {
      if (result.visible == undefined) {
        chrome.storage.sync.set({ visible: config.visible })
        setVisible(config.visible)
      } else {
        setVisible(result.visible)
      }

      if (result.instruction == undefined) {
        chrome.storage.sync.set({ instruction: config.instruction })
        setInstruction(config.instruction)
      } else {
        setInstruction(result.instruction)
      }

      if (result.cookie == undefined) {
        chrome.storage.sync.set({ cookie: config.cookie })
        setCookie(config.cookie)
      } else {
        setCookie(result.cookie)
      }
    })

    const handleChanged = (result, area) => {
      if (area === 'sync') {
        setVisible(result.visible)
        setInstruction(result.instruction)
        setCookie(result.cookie)
      }
    }
    chrome.storage.onChanged.addListener(handleChanged)
    return () => chrome.storage.onChanged.removeListener(handleChanged)
  }, [visible, instruction, cookie])



  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Jawab Cepat</h1>
      <div className="card">
        {visible != null && <button onClick={() => {
          chrome.storage.sync.set({ visible: !visible })
        }}>
          {!visible ? "Visible" : "Invisible"}
        </button>}

      </div>

      <Form.Item label="Custom Instruction">
        <Input.TextArea rows={4} value={instruction} onChange={(e) => chrome.storage.sync.set({ instruction: e.target.value })} />
      </Form.Item>

      <Form.Item label="Custom Cookie">
        <Input.TextArea rows={4} value={cookie} onChange={(e) => chrome.storage.sync.set({ cookie: e.target.value })} />
      </Form.Item>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
