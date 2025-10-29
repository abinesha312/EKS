import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react"
import { useRef } from "react"
import { FiUpload, FiFile } from "react-icons/fi"

interface DataStepProps {
  data: {
    trainingData: File[]
    validationData: File[]
    testData: File[]
  }
  onUpdate: (data: any) => void
}

function DataStep({ data, onUpdate }: DataStepProps) {
  const trainingInputRef = useRef<HTMLInputElement>(null)
  const validationInputRef = useRef<HTMLInputElement>(null)
  const testInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (
    type: "trainingData" | "validationData" | "testData",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || [])
    onUpdate({ [type]: [...data[type], ...files] })
  }

  const removeFile = (
    type: "trainingData" | "validationData" | "testData",
    index: number
  ) => {
    const newFiles = data[type].filter((_, i) => i !== index)
    onUpdate({ [type]: newFiles })
  }

  const createFileUploadSection = (
    title: string,
    description: string,
    type: "trainingData" | "validationData" | "testData",
    isRequired: boolean,
    inputRef: React.RefObject<HTMLInputElement>
  ) => (
    <Card.Root>
      <Card.Body p={6}>
        <HStack justify="space-between" mb={4}>
          <Box>
            <Text fontWeight="bold" mb={1}>
              {title}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {description}
            </Text>
          </Box>
          <Badge 
            variant={isRequired ? "solid" : "outline"} 
            colorScheme={isRequired ? "red" : "gray"}
          >
            {isRequired ? "Required" : "Optional"}
          </Badge>
        </HStack>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".csv,.json,.parquet,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(type, e)}
        />

        <Box
          border="2px dashed"
          borderColor="border.muted"
          borderRadius="md"
          p={8}
          textAlign="center"
          cursor="pointer"
          _hover={{ borderColor: "blue.500" }}
          onClick={() => inputRef.current?.click()}
        >
          <VStack gap={3}>
            <FiUpload size={24} />
            <Text>
              Drag and drop {title.toLowerCase()} here, or{" "}
              <Text as="span" color="blue.500" textDecoration="underline">
                click to browse
              </Text>
            </Text>
          </VStack>
        </Box>

        {data[type].length > 0 && (
          <Box mt={4}>
            <Text fontWeight="bold" mb={2}>
              Uploaded Files:
            </Text>
            <VStack align="stretch" gap={2}>
              {data[type].map((file, index) => (
                <HStack key={index} justify="space-between" p={2} bg="bg.muted" borderRadius="md">
                  <HStack>
                    <FiFile />
                    <Text fontSize="sm">{file.name}</Text>
                    <Text fontSize="xs" color="fg.muted">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Text>
                  </HStack>
                  <Box
                    as="button"
                    fontSize="sm"
                    color="red.500"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => removeFile(type, index)}
                  >
                    Remove
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  )

  return (
    <VStack align="stretch" gap={8} h="100%">
      <Box>
        <Heading size="md" mb={6}>
          Data Upload
        </Heading>
        
        <VStack align="stretch" gap={6}>
          {/* Training Data Upload */}
          {createFileUploadSection(
            "Training Data Upload",
            "Upload your training dataset files (.csv, .json, .parquet, .txt)",
            "trainingData",
            true,
            trainingInputRef
          )}

          {/* Validation Data Upload */}
          {createFileUploadSection(
            "Validation Data Upload",
            "Upload your validation dataset files (.csv, .json, .parquet, .txt)",
            "validationData",
            false,
            validationInputRef
          )}

          {/* Test Data Upload */}
          {createFileUploadSection(
            "Test Data Upload", 
            "Upload your test dataset files (.csv, .json, .parquet, .txt)",
            "testData",
            false,
            testInputRef
          )}
        </VStack>
      </Box>

      {/* Data Summary */}
      {(data.trainingData.length > 0 || data.validationData.length > 0 || data.testData.length > 0) && (
        <Box>
          <Heading size="md" mb={4}>
            Data Summary
          </Heading>
          
          <Card.Root>
            <Card.Body p={6}>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text>Training Files:</Text>
                  <Text fontWeight="bold">{data.trainingData.length}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Validation Files:</Text>
                  <Text fontWeight="bold">{data.validationData.length}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Test Files:</Text>
                  <Text fontWeight="bold">{data.testData.length}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Total Files:</Text>
                  <Text fontWeight="bold">
                    {data.trainingData.length + data.validationData.length + data.testData.length}
                  </Text>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Box>
      )}
    </VStack>
  )
}

export default DataStep