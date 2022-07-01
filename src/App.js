import { Box, VStack, Container, Button, HStack, Input } from "@chakra-ui/react"
import React, { useState,useEffect,useRef } from 'react';
import { app } from "./firebase"
import { Message } from "./components/Message";
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from "firebase/auth"
import {getFirestore,addDoc,collection,serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore"

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}
const logoutHandler = () => signOut(auth);


function App() {
  
  const q = query(collection(db,"Messages"),orderBy("createdAt","asc"))

  const [user, setUser] = useState(false);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  const divforScroll = useRef(null);

  const SubmitHandler = async(e) => {
    // prevent reloading after form submit
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        text : message,
        uid : user.uid,
        uri : user.photoURL,
        createdAt: serverTimestamp()
      })
      setMessage("");
      divforScroll.current.scrollIntoView({ behaviour: "smooth" });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (data) =>{
      setUser(data);
    });
    
    const unSubscribeForMessage = onSnapshot( q ,(snap)=>{
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      )
    })
    return ()=> {
      unSubscribe();
      unSubscribeForMessage();
    };
   
  }, []);
  

  return (
    <Box bg = {"red.50"}>
      {
        user ?
          <Container h={"100vh"} bg={"white"} >
          {/* vertical stack - flex column justify content centre */}
            <VStack h={"full"} paddingY={"4"} > 
            
              <Button onClick={logoutHandler} w={"full"} colorScheme={"red"}>Logout</Button>

            {/* for messages */} 
            <VStack h={"full"} w={"full"} bg={"white"} overflowY="auto" css={{
              "&::-webkit-scrollbar": {
              display:"none",
            },
          }}>{/*hiding scrollbar*/}
                {
                  messages.map(item => ( 
                    <Message
                      key={item.id}
                      user={item.uid === user.uid ? "me" : "other"}
                      text={item.text}
                      uri={item.uri} />
                  ))
                }

                {/* scrolling automatic */}
              <div ref={divforScroll}></div> 
              
              </VStack>
 
            
            <form onSubmit={SubmitHandler} style={{ width: "100%" }}>
              <HStack>
                  <Input value={ message} onChange={(e)=>{setMessage (e.target.value)}} placeholder="Enter a Message..."/>
                <Button colorScheme={"purple"} type="submit">Send</Button>  
              </HStack>
            </form>
          </VStack>
        </Container> :
          
          <VStack h={"100vh"} bg={ "white"} justifyContent={"center"}>
            <Button colorScheme="telegram" onClick={loginHandler} >Signin with Google</Button>
          </VStack>
      }
    </Box>
  );
}

export default App;
