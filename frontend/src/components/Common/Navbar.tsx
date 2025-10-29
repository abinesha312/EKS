import { Flex, HStack, useBreakpointValue, Text, Spacer, Image } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import ThemeToggle from "./ThemeToggle"
import UserMenu from "./UserMenu"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  return (
    <Flex
      display={display}
      position="sticky"
      align="center"
      w="100%"
      top={0}
      px={6}
      py={4}
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      zIndex={1000}
    >
      {/* Left side - Logo */}
      <Link to="/">
        <HStack gap={3} _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
          <Image 
            src="/assets/images/fastapi-logo.png" 
            alt="EKS Logo" 
            h="32px" 
            w="auto"
            objectFit="contain"
          />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="red.600"
            textTransform="uppercase"
            letterSpacing="wide"
            textShadow="0 2px 4px rgba(0,0,0,0.1)"
          >
            EKS
          </Text>
        </HStack>
      </Link>

      {/* Center - Navigation Links */}
      <Spacer />
      <Spacer />

      {/* Right side - User controls */}
      <HStack gap={3} alignItems="center">
        <ThemeToggle />
        <UserMenu />
      </HStack>
    </Flex>
  )
}

export default Navbar
