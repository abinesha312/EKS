import {
  Box,
  Card,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react"
import { FiCode } from "react-icons/fi"
import { InputGroup } from "@/components/ui/input-group"

interface ModelDetailsStepProps {
  data: {
    modelName: string
    modelPath: string
    modelConfiguration: string
    launchScript: string
  }
  onUpdate: (data: any) => void
}

function ModelDetailsStep({ data, onUpdate }: ModelDetailsStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <VStack align="stretch" gap={8} h="100%">
      <Box>
        <Heading size="md" mb={6}>
          Custom Service Configuration
        </Heading>
        
        <VStack align="stretch" gap={6}>
          {/* Model Name/Checkpoint Path */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Model Name/Checkpoint Path
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Optional name or path for your model checkpoint
                  </Text>
                </Box>
                <Badge variant="outline" colorScheme="gray">
                  Optional
                </Badge>
              </HStack>

              <Input
                placeholder="Enter model name or checkpoint path"
                value={data.modelName}
                onChange={(e) => handleInputChange("modelName", e.target.value)}
              />
            </Card.Body>
          </Card.Root>

          {/* Model Path */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Model Path
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Path to your model files in the system
                  </Text>
                </Box>
                <Badge variant="solid" colorScheme="red">
                  Required
                </Badge>
              </HStack>

              <InputGroup endElement={<FiCode />}>
                <Input
                  placeholder="/path/to/your/model"
                  value={data.modelPath}
                  onChange={(e) => handleInputChange("modelPath", e.target.value)}
                />
              </InputGroup>
            </Card.Body>
          </Card.Root>

          {/* Model Configuration */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Model Configuration
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    JSON or YAML configuration for your model
                  </Text>
                </Box>
                <Badge variant="outline" colorScheme="gray">
                  Optional
                </Badge>
              </HStack>

              <Textarea
                placeholder="Enter your model configuration in JSON or YAML format..."
                value={data.modelConfiguration}
                onChange={(e) => handleInputChange("modelConfiguration", e.target.value)}
                rows={8}
                fontFamily="mono"
                fontSize="sm"
              />
            </Card.Body>
          </Card.Root>

          {/* Launch Script */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Launch Script
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Script to execute when launching your model
                  </Text>
                </Box>
                <Badge variant="outline" colorScheme="gray">
                  Optional
                </Badge>
              </HStack>

              <Textarea
                placeholder="#!/bin/bash&#10;python your_model.py --config config.json"
                value={data.launchScript}
                onChange={(e) => handleInputChange("launchScript", e.target.value)}
                rows={6}
                fontFamily="mono"
                fontSize="sm"
              />
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>
    </VStack>
  )
}

export default ModelDetailsStep