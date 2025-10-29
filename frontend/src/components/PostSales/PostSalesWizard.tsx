import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Progress,
  Text,
  VStack,
  HStack,
  Separator,
} from "@chakra-ui/react"
import { useState } from "react"
import { FiServer, FiFileText, FiDatabase, FiPlay } from "react-icons/fi"

import ServerConfigStep from "./ServerConfigStep"
import ModelDetailsStep from "./ModelDetailsStep"
import DataStep from "./DataStep"
import StartModelStep from "./StartModelStep"

const steps = [
  {
    title: "Server Config",
    icon: FiServer,
    required: true,
  },
  {
    title: "Model Details", 
    icon: FiFileText,
    required: true,
  },
  {
    title: "Data",
    icon: FiDatabase,
    required: true,
  },
  {
    title: "Start the Model",
    icon: FiPlay,
    required: true,
  },
]

function PostSalesWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    serverConfig: {
      modelFiles: [],
      dataFiles: [],
      processDataAutomatically: false,
    },
    modelDetails: {
      modelName: "",
      modelPath: "",
      modelConfiguration: "",
      launchScript: "",
    },
    data: {
      trainingData: [],
      validationData: [],
      testData: [],
    },
    startModel: {
      inputConfiguration: "",
      metrics: {
        epoch: 0,
        loss: 0,
        accuracy: 0,
      },
    },
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    console.log("Wizard completed with data:", formData)
    // Handle completion logic here
  }

  const updateFormData = (stepKey: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey as keyof typeof prev], ...data }
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServerConfigStep
            data={formData.serverConfig}
            onUpdate={(data) => updateFormData("serverConfig", data)}
          />
        )
      case 1:
        return (
          <ModelDetailsStep
            data={formData.modelDetails}
            onUpdate={(data) => updateFormData("modelDetails", data)}
          />
        )
      case 2:
        return (
          <DataStep
            data={formData.data}
            onUpdate={(data) => updateFormData("data", data)}
          />
        )
      case 3:
        return (
          <StartModelStep
            data={formData.startModel}
            onUpdate={(data) => updateFormData("startModel", data)}
          />
        )
      default:
        return null
    }
  }

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box w="300px" bg="bg.subtle" p={6}>
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading size="lg" mb={2}>POST SALES</Heading>
            <Text color="fg.muted" fontSize="sm">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </Text>
          </Box>

          <Progress.Root 
            value={((currentStep + 1) / steps.length) * 100} 
            colorScheme="red"
            size="sm"
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>

          <VStack align="stretch" gap={4}>
            {steps.map((step, index) => (
              <Card.Root key={step.title} variant={index === currentStep ? "elevated" : "outline"}>
                <Card.Body p={4}>
                  <HStack gap={3}>
                    <Box
                      as={step.icon}
                      boxSize={5}
                      color={index <= currentStep ? "blue.500" : "fg.muted"}
                    />
                    <Box flex={1}>
                      <Text 
                        fontWeight={index === currentStep ? "bold" : "normal"}
                        color={index <= currentStep ? "fg.default" : "fg.muted"}
                      >
                        {step.title}
                      </Text>
                      {step.required && (
                        <Text fontSize="xs" color="red.500">
                          Required
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={8}>
        <VStack align="stretch" gap={6} h="100%">
          <Box>
            <Heading size="xl" mb={2}>
              {steps[currentStep].title}
            </Heading>
            <Text color="fg.muted">
              Step {currentStep + 1} of {steps.length}
            </Text>
          </Box>

          <Separator />

          <Box flex={1}>
            {renderStepContent()}
          </Box>

          <Separator />

          <HStack justify="space-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <Text fontSize="sm" color="fg.muted">
              All your progress is saved automatically
            </Text>

            {currentStep === steps.length - 1 ? (
              <Button
                colorScheme="red"
                onClick={handleComplete}
              >
                Complete
              </Button>
            ) : (
              <Button
                colorScheme="red"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </Flex>
  )
}

export default PostSalesWizard