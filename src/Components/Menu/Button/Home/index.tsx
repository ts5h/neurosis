import { useCallback, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { ArrowBackToHome } from "@/icons";
import Styles from "@/styles/MenuHome.module.scss";

export const MenuButtonHome = () => {
  const [isHover, setIsHover] = useState(false);

  const handleHover = useCallback((state: boolean) => {
    if (isMobile) return false;
    setIsHover(state);
    return false;
  }, []);

  const handleTouch = useCallback((state: boolean) => {
    if (!isMobile) return false;
    setIsHover(state);
    return false;
  }, []);

  const handleClick = useCallback(() => {
    window.location.href = "/";
    return false;
  }, []);

  return (
    <button
      type="button"
      className={`${Styles.menu} ${isHover ? Styles.on : ""} ${isTablet ? Styles.tablet : ""}`}
      onMouseOver={() => handleHover(true)}
      onMouseOut={() => handleHover(false)}
      onFocus={() => handleHover(true)}
      onBlur={() => handleHover(false)}
      onTouchStart={() => handleTouch(true)}
      onTouchEnd={() => handleTouch(false)}
      onClick={handleClick}
    >
      <div className={Styles.icon}>
        <ArrowBackToHome />
      </div>
      <p>HOME</p>
    </button>
  );
};
