import { useState } from "react";
import { isMobile } from "react-device-detect";
import { AiFillGithub } from "react-icons/ai";
import Styles from "@/styles/Menu.module.scss";

type Props = {
  repositoryUrl?: string;
};

export const MenuButtonGitHub = ({ repositoryUrl }: Props) => {
  const [isHover, setIsHover] = useState(false);

  const handleHover = (state: boolean) => {
    if (isMobile) return;
    setIsHover(state);
  };

  const handleTouch = (state: boolean) => {
    if (!isMobile) return;
    setIsHover(state);
  };

  const handleClick = () => {
    if (!repositoryUrl) return;
    window.open(repositoryUrl);
  };

  return (
    <button
      type="button"
      onMouseOver={() => handleHover(true)}
      onMouseOut={() => handleHover(false)}
      onFocus={() => handleHover(true)}
      onBlur={() => handleHover(false)}
      onTouchStart={() => handleTouch(true)}
      onTouchEnd={() => handleTouch(false)}
      onClick={handleClick}
      className={isHover ? Styles.on : ""}
      title="GitHub"
    >
      <AiFillGithub className={Styles.icon} />
    </button>
  );
};
