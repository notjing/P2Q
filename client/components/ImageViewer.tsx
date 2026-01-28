import { Image } from "expo-image";
import { StyleSheet } from "react-native";


type Props = {
    imageSource: any;
}

export default function ImageViewer({ imageSource }: Props) {
    return (
        <Image source={imageSource} style={styles.image} />
    );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 18,
  },
});