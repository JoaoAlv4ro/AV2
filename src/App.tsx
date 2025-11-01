import Navbar from "./components/ui/Navbar"
import Sidebar from "./components/ui/Sidebar"
import { useState } from "react"

function App() {
  const [aeronaveAtual, setAeronaveAtual] = useState<string>("");

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar aeronaveModelo={aeronaveAtual} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aeronaveModelo={aeronaveAtual} />
        <div>AAAAAAAAAAAAA</div>
      </div>
    </div>
  );
}

export default App
