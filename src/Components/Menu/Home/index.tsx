import Styles from "@/Styles/Components/MenuHome.module.scss";
import { MenuButtonHome } from "@/Components/Menu/Button/Home";

export const MenuHome = () => {
  return (
    <div className={Styles.wrapper}>
      <MenuButtonHome />
    </div>
  );
};
