import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function GameEndModal({closeModal, displayGameEnd, message, returnToLobby} : any){
    return (
       <Modal
            animationType="slide"
            onRequestClose={closeModal}
            transparent={true}
            visible={displayGameEnd}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalCard}>
                    <Text style={styles.storyText}>
                        {message}
                    </Text>

                    <Pressable onPress={() => {closeModal(); returnToLobby();}} 
                        style={styles.closeButton}>
                        <MaterialIcons name="keyboard-return" size={28} color="black" />  
                    </Pressable>

                    <Pressable onPress={closeModal} style={styles.closeButton}>
                        <MaterialIcons name="close" size={28} color="black" />
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(43, 45, 66, 0.9)', 
        padding: 20,
    },
    modalCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#000',
        borderBottomWidth: 8,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    storyText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 28,
    },
    closeButton: {
        backgroundColor: '#EF476F',
        padding: 10,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#000',
        borderBottomWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
    }
});