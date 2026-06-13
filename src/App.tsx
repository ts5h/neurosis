import { CrankDrawer } from "@/Components/CrankDrawer";
import "@/styles/App.css";
import { MenuHome } from "@/Components/Menu/Home";
import { Menu } from "@/Components/Menu";

function App() {
  return (
    <>
      <CrankDrawer />
      <MenuHome />
      <Menu repositoryUrl={"https://github.com/ts5h/crank_drawer_2026_wasm"} />
    </>
  );
}

export default App;
