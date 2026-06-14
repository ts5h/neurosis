import Styles from "@/Styles/Components/Menu.module.scss";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { IoMdHelpCircleOutline } from "react-icons/io";

export const MenuButtonHelp = () => {
  const [isHover, setIsHover] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);

  const handleHover = (state: boolean) => {
    if (isMobile) return;
    setIsHover(state);
  };

  const handleTouch = (state: boolean) => {
    if (!isMobile) return;
    setIsHover(state);
  };

  const handleClick = () => {
    //
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
      title="Help"
    >
      <IoMdHelpCircleOutline className={Styles.icon} />
    </button>
  );
};
