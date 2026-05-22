import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invitation from "@/pages/Invitation";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Invitation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
