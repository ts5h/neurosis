import Styles from "@/styles/Menu.module.scss";
import { MenuButtonGitHub } from "@/Components/Menu/Button/GitHub";
import { MenuButtonReload } from "@/Components/Menu/Button/Reload";

type Props = {
  showReload?: boolean;
  repositoryUrl?: string;
};

export const Menu = ({ showReload = false, repositoryUrl }: Props) => {
  return (
    <div className={Styles.wrapper}>
      <nav className={Styles.nav}>
        {showReload && <MenuButtonReload />}
        <MenuButtonGitHub repositoryUrl={repositoryUrl} />
      </nav>
    </div>
  );
};
