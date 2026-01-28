import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8bff7b",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "fff",
  }
});

export default function NotFound() {
  return (
    <>
        <Stack.Screen options={{title: "Oops! The page you were looking for does not exist."}}/>
        <View
        style={styles.container}
        >
        <Link href={"/play"} style = {styles.button}> Go to Main Menu</Link>
        </View>
    </>
  );
}
