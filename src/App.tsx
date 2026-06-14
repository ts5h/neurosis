import { Neurosis } from "@/Components/Neurosis";
import { MenuHome } from "@/Components/Menu/Home";
import { Menu } from "@/Components/Menu";
import { Theme } from "@radix-ui/themes";
import Styles from "@/Styles/App.module.scss";

function App() {
  return (
    <div className={Styles.wrapper}>
      <Theme>
        <Menu />
        <MenuHome />
        <Neurosis />
      </Theme>
    </div>
  );
}

export default App;
