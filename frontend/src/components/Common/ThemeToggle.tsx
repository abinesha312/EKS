import { Button } from "@chakra-ui/react"
import { FiMoon, FiSun } from "react-icons/fi"
import { useColorMode } from "../ui/color-mode"

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
      color="gray.700"
      _hover={{ bg: "rgba(255, 255, 255, 0.2)", color: "red.600" }}
      _active={{ bg: "rgba(255, 255, 255, 0.3)" }}
      aria-label="Toggle color mode"
      data-testid="theme-toggle"
      transition="all 0.2s"
    >
      {colorMode === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
    </Button>
  )
}

export default ThemeToggle