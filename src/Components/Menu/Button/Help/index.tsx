import Styles from "@/Styles/Components/Menu.module.scss";
import { useState, useRef } from "react";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Button, Heading, Popover, Flex, Text } from "@radix-ui/themes";
import { useOnClickOutside } from "usehooks-ts";

export const MenuButtonHelp = () => {
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsHover(true);
    setOpen(true);
  };

  const handleClose = () => {
    setIsHover(false);
    setOpen(false);
  };

  // @ts-expect-error
  useOnClickOutside(ref, handleClose);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger>
        <button
          type="button"
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
          onFocus={() => {}}
          onBlur={() => {}}
          onTouchStart={() => setIsHover(true)}
          onTouchEnd={() => setIsHover(false)}
          onClick={handleClick}
          className={isHover || open ? Styles.on : ""}
          title="Help"
        >
          <IoMdHelpCircleOutline className={Styles.helpIcon} />
        </button>
      </Popover.Trigger>
      <Popover.Content
        width={"290px"}
        size={"1"}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        ref={ref}
      >
        <Button
          color={"gray"}
          variant={"ghost"}
          size={"2"}
          style={{
            position: "absolute",
            top: "6px",
            right: "10px",
            padding: "4px",
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <IoClose />
        </Button>
        <Flex direction="column" gap={"1"}>
          <Heading as={"h2"} size={"1"} style={{ fontWeight: 500 }}>
            Kira Kira ☆ Neurosis (2022)
          </Heading>
          <Text size={"1"} style={{ lineHeight: 1.35 }}>
            This work explores the suffocating social pressure in Japan to
            constantly appear "sparkling" (Kira Kira) and seek collective
            approval on social media. The rapidly and endless changing emojis
            represent the obsessive, relentless messages we receive from our
            real/digital communities. Then, there is some empty spaces. They
            might indicate that someone is absent or has gone missing.
          </Text>
          <Text size={"1"} style={{ lineHeight: 1.35 }}>
            Click the screen to pause the update. While most emojis will align
            in a uniform pattern—symbolizing conformity—a few distinct emojis
            remain, representing those who hold onto their own thoughts and
            styles against the pressure.
          </Text>
          <Text size={"1"} style={{ lineHeight: 1.35 }}>
            Click again to restart the cycle.
          </Text>
          <Text size={"1"} style={{ lineHeight: 1.35 }}>
            That are all the functionality of this work. The unease you may feel
            might be the core of this work—a reflection of the constant pressure
            to be 'extraordinary' in an ordinary digital world.
          </Text>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
