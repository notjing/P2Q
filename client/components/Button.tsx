import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    label: string;
    theme?: "primary"
}

export default function Button({label, theme}: Props) {
    return(theme == "primary"? 
         (
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => alert("button pressed")}>
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
        :
        (
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, {backgroundColor: "#4caf50"}]} onPress={() => alert("button pressed")}>
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    }
})


