import { Neurosis } from "@/Components/Neurosis";
import "@/styles/App.css";
import { MenuHome } from "@/Components/Menu/Home";
import { Menu } from "@/Components/Menu";

function App() {
  return (
    <>
      <Neurosis />
      <MenuHome />
      <Menu repositoryUrl={"https://github.com/ts5h/neurosis_2"} />
    </>
  );
}

export default App;
