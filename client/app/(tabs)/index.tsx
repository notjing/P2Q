import { socket } from "@/services/socket";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const avocadoImg = require("../../assets/images/avocado.png");

export default function Index() {
  const router = useRouter();

  function startGame (){
    socket.emit("gameStart");
    router.push("/play")
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={avocadoImg} style={styles.image} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>fruit mafia game</Text>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 }
          ]}
          onPress={startGame}
        >
          <Text style={styles.buttonText}>Play</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8bff7b", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    flex: 2, 
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 40,
    textAlign: "center",
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: "#2c3e50",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff", 
    textTransform: "uppercase",
  },
});