import { Neurosis } from "@/Components/Neurosis";
import { MenuHome } from "@/Components/Menu/Home";
import { Menu } from "@/Components/Menu";
import { Theme } from "@radix-ui/themes";

function App() {
  return (
    <Theme>
      <Menu />
      <MenuHome />
      <Neurosis />
    </Theme>
  );
}

export default App;
