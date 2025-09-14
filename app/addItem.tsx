import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function addItem() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleAdd = async () => {
    if (!itemName) return;
    await firestore().collection("items").add({
      itemName,
      description,
      tags: tags.split(",").map((t) => t.trim()), // simple comma-separated tags
      createdBy: auth().currentUser?.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Item</Text>
      <TextInput placeholder="Item Name" value={itemName} onChangeText={setItemName} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput
        placeholder="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />
      <Button title="Save Item" onPress={handleAdd} />
    </View>
  );
}