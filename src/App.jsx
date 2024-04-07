import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from 'react'
function App() {

  const [visible, setVisible] = useState(null)
  
  useEffect(() => {
    chrome.storage.sync.get(['instruction', 'cookies'], (result) => {
      if (result.visible == undefined) {
        const defaultVisible = false
        chrome.storage.sync.set({ visible: defaultVisible })
        setVisible(defaultVisible)
      }
      else {
        setVisible(result.visible)
      }
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.get(['visible'], (result) => {
      if (result.visible == undefined) {
        const defaultVisible = false
        chrome.storage.sync.set({ visible: defaultVisible })
        setVisible(defaultVisible)
      }
      else {
        setVisible(result.visible)
      }
    })

    const handleChanged = (result, area) => {
      if (area === 'sync') {
        setVisible(result.visible)
      }
    }
    chrome.storage.onChanged.addListener(handleChanged)
    return () => chrome.storage.onChanged.removeListener(handleChanged)
  }, [visible])



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
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
