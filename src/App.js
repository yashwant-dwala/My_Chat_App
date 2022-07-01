import { Box, VStack, Container, Button, HStack, Input } from "@chakra-ui/react"
import { Message } from "./components/Message";

function App() {
  return (
    <Box bg = {"red.50"}>
      <Container h={"100vh"} bg={"white"} >
         {/* vertical stack - flex column justify content centre */}
        <VStack h = {"full"} bg ={"telegram.100"} paddingY={"4"}> 
          
          <Button w={"full"} colorScheme={"red"}>Logout</Button>

          {/* for messages */}
          <VStack h={"full"} w={"full"} bg={"telegram.100"} overflowY="auto">
            <Message  text = "sample Text" uri = "#"/>
            <Message user = "me" text = "sample Text" uri = "#"/>
          </VStack>

          
          <form style={{ width: "100%" }}>
            <HStack>
              <Input placeholder="Enter a Message..."/>
              <Button colorScheme={"purple"} type="submit">Send</Button>  
            </HStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
