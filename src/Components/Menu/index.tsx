import Styles from "@/Styles/Components/Menu.module.scss";
import { MenuButtonGitHub } from "@/Components/Menu/Button/GitHub";
import { MenuButtonReload } from "@/Components/Menu/Button/Reload";
import { MenuButtonHelp } from "@/Components/Menu/Button/Help";

type Props = {
  showReload?: boolean;
  repositoryUrl?: string;
};

export const Menu = ({ showReload = false, repositoryUrl }: Props) => {
  return (
    <div className={Styles.wrapper}>
      <nav className={Styles.nav}>
        <MenuButtonHelp />
        {showReload && <MenuButtonReload />}
        {repositoryUrl && <MenuButtonGitHub repositoryUrl={repositoryUrl} />}
      </nav>
    </div>
  );
};
