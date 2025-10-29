import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  Textarea,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
} from "@chakra-ui/react"
import { useState } from "react"
import { FiPlay, FiSettings } from "react-icons/fi"

interface StartModelStepProps {
  data: {
    inputConfiguration: string
    metrics: {
      epoch: number
      loss: number
      accuracy: number
    }
  }
  onUpdate: (data: any) => void
}

function StartModelStep({ data, onUpdate }: StartModelStepProps) {
  const [isTraining, setIsTraining] = useState(false)
  const [logs, setLogs] = useState([
    "System initialized...",
    "Loading model configuration...",
    "Ready to start training",
  ])

  const handleInputConfigurationChange = (value: string) => {
    onUpdate({ inputConfiguration: value })
  }

  const handleStartTraining = () => {
    setIsTraining(true)
    
    // Simulate training logs
    const newLogs = [
      ...logs,
      "Starting model training...",
      "Epoch 1/100 - Loss: 0.95 - Accuracy: 0.65",
      "Epoch 2/100 - Loss: 0.87 - Accuracy: 0.72",
      "Epoch 3/100 - Loss: 0.82 - Accuracy: 0.76",
      "Training in progress...",
    ]
    setLogs(newLogs)

    // Simulate metrics update
    setTimeout(() => {
      onUpdate({
        metrics: {
          epoch: 3,
          loss: 0.82,
          accuracy: 76.2,
        },
      })
    }, 1000)
  }

  const handleTestConfiguration = () => {
    const testLogs = [
      ...logs,
      "Testing configuration...",
      "Configuration validated successfully",
      "All parameters are within expected ranges",
    ]
    setLogs(testLogs)
  }

  return (
    <VStack align="stretch" gap={8} h="100%">
      {/* Model Configuration */}
      <Box>
        <Heading size="md" mb={6}>
          Model Configuration
        </Heading>
        
        <VStack align="stretch" gap={6}>
          {/* Input Configuration */}
          <Card.Root>
            <Card.Body p={6}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Input Configuration
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Configure input parameters for your model training
                  </Text>
                </Box>
                <Badge variant="outline" colorScheme="gray">
                  Optional
                </Badge>
              </HStack>

              <Textarea
                placeholder="Enter training configuration (JSON format)&#10;{&#10;  &quot;learning_rate&quot;: 0.001,&#10;  &quot;batch_size&quot;: 32,&#10;  &quot;epochs&quot;: 100&#10;}"
                value={data.inputConfiguration}
                onChange={(e) => handleInputConfigurationChange(e.target.value)}
                rows={8}
                fontFamily="mono"
                fontSize="sm"
              />
            </Card.Body>
          </Card.Root>

          {/* Action Buttons */}
          <Card.Root>
            <Card.Body p={6}>
                              <HStack gap={4}>
                <Button
                  colorScheme="red"
                  size="lg"
                  onClick={handleStartTraining}
                  loading={isTraining}
                  loadingText="Training..."
                >
                  <FiPlay />
                  Start Model Training
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleTestConfiguration}
                >
                  <FiSettings />
                  Test Configuration
                </Button>
              </HStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>

      {/* Model Output/Monitor */}
      <Box>
        <Heading size="md" mb={6}>
          Model Output/Monitor
        </Heading>
        
        <VStack align="stretch" gap={6}>
          {/* Console Output */}
          <Card.Root>
            <Card.Body p={6}>
              <Text fontWeight="bold" mb={4}>
                Console Output
              </Text>
              
              <Box
                bg="black"
                color="green.400"
                p={4}
                borderRadius="md"
                fontFamily="mono"
                fontSize="sm"
                h="200px"
                overflowY="auto"
              >
                {logs.map((log, index) => (
                  <Text key={index}>
                    {"> "}{log}
                  </Text>
                ))}
                {isTraining && (
                  <Text color="yellow.400">
                    {">"} Training in progress... ⚡
                  </Text>
                )}
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Real-time Metrics */}
          <Card.Root>
            <Card.Body p={6}>
              <Text fontWeight="bold" mb={4}>
                Real-time Metrics Dashboard
              </Text>
              
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem>
                  <Card.Root variant="outline">
                    <Box p={4} textAlign="center">
                      <Text fontSize="sm" color="fg.muted" mb={1}>
                        Current Epoch
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                        {data.metrics.epoch}
                      </Text>
                    </Box>
                  </Card.Root>
                </GridItem>
                
                <GridItem>
                  <Card.Root variant="outline">
                    <Box p={4} textAlign="center">
                      <Text fontSize="sm" color="fg.muted" mb={1}>
                        Loss
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="red.500">
                        {data.metrics.loss.toFixed(3)}
                      </Text>
                    </Box>
                  </Card.Root>
                </GridItem>
                
                <GridItem>
                  <Card.Root variant="outline">
                    <Box p={4} textAlign="center">
                      <Text fontSize="sm" color="fg.muted" mb={1}>
                        Accuracy
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">
                        {data.metrics.accuracy.toFixed(1)}%
                      </Text>
                    </Box>
                  </Card.Root>
                </GridItem>
              </Grid>
              
              {!isTraining && data.metrics.epoch === 0 && (
                <Box mt={4} textAlign="center">
                  <Text fontSize="sm" color="fg.muted">
                    Start training to see real-time metrics
                  </Text>
                </Box>
              )}
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>
    </VStack>
  )
}

export default StartModelStep