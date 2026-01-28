import ChatModal from "@/components/ChatModal";
import GameEndModal from "@/components/GameEndModal";
import ImageViewer from "@/components/ImageViewer";
import StoryModal from "@/components/StoryModal";
import { socket } from "@/services/socket";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const avocadoImg = require("../../assets/images/avocado.png")
const deadAvocadoImg = require("../../assets/images/dead_avocado.png")

export default function MainMenu() {
    const router = useRouter();

    const [gameState, setGameState] = useState<any>(null);
    const [playerId, setPlayerId] = useState<null | number>(null);
    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const[displayStory, setDisplayStory] = useState<boolean>(false);
    const[lastDisplayedDay, setLastDisplayedDay] = useState<number>(0);

    const[displayGameEnd, setDisplayGameEnd] = useState<boolean>(false);
    const[gameEnd, setGameEnd] = useState<number>(0); // -1 mafia win, 1 town win, 0 game is still going

    useEffect(() =>{
        if(gameState != null && gameEnd == 0){
            const isNewDay = gameState.phase === "day" && gameState.dayCount > lastDisplayedDay;
            const isVoteResultTime = gameState.phase === "night" && gameState.story !== "";

            if (isNewDay || isVoteResultTime) {
                setDisplayStory(true);
            }
            
            if (isNewDay) {
                setLastDisplayedDay(gameState.dayCount);
            }
        }

       
    }, [gameState?.phase, gameState?.dayCount, gameState?.story])

    useEffect(() => {

        socket.on("joined_game", (playerId: number) => {
            setPlayerId(playerId);
        })

        socket.on("gameState", (newState: any) => {
            setGameState(newState)
        });

        socket.on("updateGame", (newState: any) => {
            setGameState(newState);
        });

        socket.on("gameEnd", (winner : number) => {
            console.log("GAME OVVVVVERRRRRRRRRRRRRRRR2")
            setGameEnd(winner);
            setDisplayGameEnd(true);
        })

        socket.emit("request_player_id")

        socket.emit("request_game_state");

        return () => {
            socket.off("joined_game");
            socket.off("gameState");
            socket.off("updateGame");
            socket.off("gameEnd");    
        };
    }, [])

    function sendVote(id : number) {
        socket.emit("cast_vote", {voterId: playerId, targetId: id});
    }

    function sendKill(id: number){
        console.log("sending kill")
        socket.emit("kill", {victimID: id});
    }

    function openChat(){
        setChatOpen(true);
    }

    function closeChat(){
        setChatOpen(false);
    }

    function closeStory(){
        setDisplayStory(false);
    }

    function returnToLobby(){
        reset();
        router.push("/");
    }

    function reset(){
        setGameEnd(0);
        setLastDisplayedDay(0);
        setDisplayStory(false);
        setDisplayGameEnd(false);
    }
    
    if(!gameState) return <Text>Connecting...</Text>

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}> 
                    <Text style={styles.phaseText}> {gameState.phase} {gameState.dayCount} </Text>
                    <View style={styles.headerButtons}>
                        {gameEnd &&
                            <Pressable onPress={returnToLobby}> 
                                <MaterialIcons style={styles.chatButton} name="keyboard-return" size={28} color="black" />
                            </Pressable>    
                        }
                        <Pressable onPress={openChat}> 
                            <MaterialIcons style={styles.chatButton} name="info" size={28} color="black" />
                        </Pressable>    
                        <Pressable onPress={openChat}> 
                            <MaterialIcons style={styles.chatButton} name="chat" size={28} color="black" />
                        </Pressable>  
                    </View>
                                 
                </View>
                

                {gameState.players.map((p: any) => {
                    return(
                        <View  style={p.state == "ALIVE" ? styles.playerRow : styles.playerRowDead} key={p.id}>
                            <Text style={styles.playerName}> {p.name} </Text>
                            {p.id !== playerId && (
                                gameState.phase === "day" ? (
                                    <Pressable onPress={() => !gameEnd && sendVote(p.id)}>
                                        <Text style={styles.voteTrackerText}>vote</Text>
                                    </Pressable>
                                ) : (gameState.phase === "night" && 
                                    gameState.players.find((q: any) => q.id === playerId)?.role === "MAFIA" && 
                                    p.state === "ALIVE") ? (
                                    <Pressable onPress={() => !gameEnd && sendKill(p.id)}>
                                        <Text style={styles.killText}>KILL</Text>
                                    </Pressable>
                                ) : null
                            )}
                            {p.state == "ALIVE" ?
                                <ImageViewer imageSource={avocadoImg}></ImageViewer>
                                :
                                <ImageViewer imageSource={deadAvocadoImg}></ImageViewer>
                            }
                            
                            
                        </View>
                    )
                })}
                
            </ScrollView>

            <ChatModal closeChat={closeChat} chatOpen={chatOpen} playerId={playerId} players={gameState.players}/>
            <StoryModal closeStory={closeStory} displayStory={displayStory} story={gameState.story}/>
            <GameEndModal closeModal={()=>{setDisplayGameEnd(false)}} displayGameEnd={displayGameEnd} message={"wsp"} returnToLobby={returnToLobby}/>
            
        </View>

    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#2B2D42', 
        padding: 20,
        paddingTop: 60, 
    },

    header: {
        flexDirection: 'row',            
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FFD166', 
        paddingVertical: 12,
        borderRadius: 8,
        
        borderWidth: 4,
        borderColor: '#000',
        borderBottomWidth: 8, 
        marginBottom: 25,
    },
    phaseText: {
        fontSize: 26,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    playerRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#06D6A0', 
        padding: 15,
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#000',
        borderBottomWidth: 6,
    },

    playerRowDead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#4A4E69',
        padding: 15,
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#222',
        borderBottomWidth: 6,
        opacity: 0.6, 
    },

    playerName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        textTransform: 'uppercase',
    },

    headerButtons: {
        flexDirection: "row",
    },

    chatButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#EF476F', 
        padding: 10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#000',
        borderBottomWidth: 6,
        marginRight: 15
    },

    voteTrackerText: {
        marginTop: 20, 
        fontWeight: "900",
        color: '#FFF',
        fontSize: 18,
    },

    killText: {
        marginTop: 20, 
        fontWeight: "900",
        color: '#EF476F', 
        fontSize: 18,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }
})