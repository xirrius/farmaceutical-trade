import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Check, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const changeLanguage = () => {
      i18n.changeLanguage(lang);
    };
    changeLanguage();
  }, [lang, i18n]);

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent"
            radius="sm"
            variant="light"
            isIconOnly
          >
            <Languages color="blue" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="en"
            onClick={() => setLang("en")}
            endContent={lang === "en" ? <Check color="blue" /> : ""}
          >
            English
          </DropdownItem>
          <DropdownItem
            key="hi"
            onClick={() => setLang("hi")}
            endContent={lang === "hi" ? <Check color="blue" /> : ""}
          >
            हिंदी
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default LanguageSwitcher;
