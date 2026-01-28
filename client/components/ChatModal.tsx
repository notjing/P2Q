import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Message = {
    senderId: number;
    senderName: string,
    message: string;
}

export default function ChatModal({closeChat, chatOpen, playerId, players} : any){

    const [messages, setMessages] = useState<Message[]>([
        {senderId: 2, senderName: "Henry", message: "this is a reeeeeeeeeeeeeeeeeeeeeealy long test message from Henry"},
        {senderId: 1, senderName: "Ethan", message: "this is a test message from Ethan"}
    ]);

    const [textVal, setTextVal] = useState<string>("");

    function onSubmit(e: any){
        const newMessage = {
            senderId: playerId,
            senderName: players.find((p:any) => {return p.id == playerId}).name,
            message: textVal
        }

        setMessages([...messages, newMessage])
        setTextVal("")
    }

    return(
        <Modal
            animationType="slide"
            onRequestClose={closeChat}
            transparent={true}
            visible={chatOpen}
        >

            <KeyboardAvoidingView
                    style={styles.chatContainer}
                    behavior='padding'
                    >

                        <View style={styles.chatHeader}>
                            <Text style={styles.headerText}> Who is the Mafia? </Text>
                            <Pressable onPress={closeChat}>
                                <MaterialIcons name="close" size={28} color="black" />
                            </Pressable>
                        </View>

                        <FlatList
                            style={styles.messageList}
                            data={messages}
                            extraData={[playerId, messages]}
                            renderItem={({item}) => {
                                return(
                                    <View style={[
                                            styles.messageBubble, 
                                            item.senderId == playerId ? styles.myMessage : styles.otherMessage
                                        ]}>
                                        <Text style={styles.senderName}>{item.senderId == playerId ? "Me" : item.senderName}</Text>
                                        <Text>{item.message}</Text>
                                    </View>
                                )
                            }}
                        >
                        </FlatList>

                        <TextInput 
                            style={styles.textInput}
                            placeholder='Press to type a message'
                            placeholderTextColor={"black"}
                            value={textVal}
                            onChangeText={(text)=> setTextVal(text)}
                            onSubmitEditing={(e) => onSubmit(e)}
                            >
                        </TextInput>
           </KeyboardAvoidingView>

                

        </Modal>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        backgroundColor: '#2B2D42', 
        paddingTop: 60,
    },

    chatHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FFD166',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: '#000',
        marginBottom: 20,
    },

    headerText: {
        fontSize: 22,
        fontWeight: '900', 
        color: '#000',
        letterSpacing: 1.5,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },

    closeButton: {
        backgroundColor: '#EF476F', 
        padding: 4,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000',
        borderBottomWidth: 4, 
    },

    messageList: {
        flex: 1,
        marginBottom: 10
    },

    messageBubble: {
        maxWidth: '75%', 
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 6,
        marginHorizontal: 15,
        borderRadius: 16,
        
        borderWidth: 3,
        borderColor: '#000',
        borderBottomWidth: 7, 
    },

    myMessage: {
        alignSelf: 'flex-end', 
        backgroundColor: '#06D6A0',
        borderBottomRightRadius: 4,
    },

    otherMessage: {
        alignSelf: 'flex-start', 
        backgroundColor: '#EF476F', 
        borderBottomLeftRadius: 4,
    },

    senderName: {
        fontSize: 12,
        color: '#000',
        fontWeight: '900',
        marginBottom: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },

    messageText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '700', 
    },

   textInput: {
        backgroundColor: "white",
        
        paddingVertical: 15,  
        paddingHorizontal: 20, 
        fontSize: 16,          
        fontWeight: '800',
        color: "black",
        
        marginHorizontal: 15,  
        marginBottom: 25,      
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#000',
        borderBottomWidth: 6,  
    }
})