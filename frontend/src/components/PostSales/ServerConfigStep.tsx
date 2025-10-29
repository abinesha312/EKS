import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react"
import { useRef } from "react"
import { FiUpload, FiFile, FiPlay } from "react-icons/fi"
import { Checkbox } from "@/components/ui/checkbox"

interface ServerConfigStepProps {
  data: {
    modelFiles: File[]
    dataFiles: File[]
    processDataAutomatically: boolean
  }
  onUpdate: (data: any) => void
}

function ServerConfigStep({ data, onUpdate }: ServerConfigStepProps) {
  const modelFileInputRef = useRef<HTMLInputElement>(null)
  const dataFileInputRef = useRef<HTMLInputElement>(null)

  const handleModelFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    onUpdate({ modelFiles: [...data.modelFiles, ...files] })
  }

  const handleDataFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    onUpdate({ dataFiles: [...data.dataFiles, ...files] })
  }

  const handleProcessDataChange = (checked: boolean) => {
    onUpdate({ processDataAutomatically: checked })
  }

  const removeModelFile = (index: number) => {
    const newFiles = data.modelFiles.filter((_, i) => i !== index)
    onUpdate({ modelFiles: newFiles })
  }

  const removeDataFile = (index: number) => {
    const newFiles = data.dataFiles.filter((_, i) => i !== index)
    onUpdate({ dataFiles: newFiles })
  }

  return (
    <VStack align="stretch" gap={8} h="100%">
      {/* Upload Model and Data Section */}
      <Box>
        <Heading size="md" mb={4}>
          Upload Model and Data
        </Heading>
        
        <VStack align="stretch" gap={6}>
          {/* Model Files Upload */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Model Files
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Upload your model files (.pkl, .pth, .h5, .onnx up to 10GB)
                  </Text>
                </Box>
                <Badge variant="solid" colorScheme="red">
                  Required
                </Badge>
              </HStack>

              <input
                ref={modelFileInputRef}
                type="file"
                multiple
                accept=".pkl,.pth,.h5,.onnx"
                style={{ display: "none" }}
                onChange={handleModelFileUpload}
              />

              <Box
                border="2px dashed"
                borderColor="border.muted"
                borderRadius="md"
                p={8}
                textAlign="center"
                cursor="pointer"
                _hover={{ borderColor: "blue.500" }}
                onClick={() => modelFileInputRef.current?.click()}
              >
                <VStack gap={3}>
                  <FiUpload size={24} />
                  <Text>
                    Drag and drop model files here, or{" "}
                    <Text as="span" color="blue.500" textDecoration="underline">
                      click to browse
                    </Text>
                  </Text>
                </VStack>
              </Box>

              {data.modelFiles.length > 0 && (
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    Uploaded Files:
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {data.modelFiles.map((file, index) => (
                      <HStack key={index} justify="space-between" p={2} bg="bg.muted" borderRadius="md">
                        <HStack>
                          <FiFile />
                          <Text fontSize="sm">{file.name}</Text>
                        </HStack>
                        <Button size="sm" variant="ghost" onClick={() => removeModelFile(index)}>
                          Remove
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </Card.Body>
          </Card.Root>

          {/* Data Files Upload */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Data Files
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Upload your data files (.csv, .json, .parquet up to 5GB)
                  </Text>
                </Box>
                <Badge variant="solid" colorScheme="red">
                  Required
                </Badge>
              </HStack>

              <input
                ref={dataFileInputRef}
                type="file"
                multiple
                accept=".csv,.json,.parquet"
                style={{ display: "none" }}
                onChange={handleDataFileUpload}
              />

              <Box
                border="2px dashed"
                borderColor="border.muted"
                borderRadius="md"
                p={8}
                textAlign="center"
                cursor="pointer"
                _hover={{ borderColor: "blue.500" }}
                onClick={() => dataFileInputRef.current?.click()}
              >
                <VStack gap={3}>
                  <FiUpload size={24} />
                  <Text>
                    Drag and drop data files here, or{" "}
                    <Text as="span" color="blue.500" textDecoration="underline">
                      click to browse
                    </Text>
                  </Text>
                </VStack>
              </Box>

              {data.dataFiles.length > 0 && (
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    Uploaded Files:
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {data.dataFiles.map((file, index) => (
                      <HStack key={index} justify="space-between" p={2} bg="bg.muted" borderRadius="md">
                        <HStack>
                          <FiFile />
                          <Text fontSize="sm">{file.name}</Text>
                        </HStack>
                        <Button size="sm" variant="ghost" onClick={() => removeDataFile(index)}>
                          Remove
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              <Box mt={4}>
                <Checkbox
                  checked={data.processDataAutomatically}
                  onCheckedChange={(checked) => handleProcessDataChange(!!checked)}
                >
                  Process data automatically
                </Checkbox>
              </Box>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>

      {/* Execute Model Section */}
      <Box>
        <Heading size="md" mb={4}>
          Execute Model
        </Heading>
        
        <Card.Root>
          <Card.Body p={6}>
            <VStack align="stretch" gap={4}>
              <Button
                colorScheme="red"
                size="lg"
                disabled={data.modelFiles.length === 0 || data.dataFiles.length === 0}
              >
                <FiPlay />
                Execute
              </Button>
              
              {data.modelFiles.length === 0 || data.dataFiles.length === 0 ? (
                <Text fontSize="sm" color="orange.500" textAlign="center">
                  Please upload both model and data files to enable execution
                </Text>
              ) : (
                <Text fontSize="sm" color="green.500" textAlign="center">
                  Ready to execute with {data.modelFiles.length} model file(s) and {data.dataFiles.length} data file(s)
                </Text>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    </VStack>
  )
}

export default ServerConfigStep