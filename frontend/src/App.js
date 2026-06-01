import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invitation from "@/pages/Invitation";
import InvitationV1 from "@/pages/v1/Invitation";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Invitation />} />
          <Route path="/v1" element={<InvitationV1 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
