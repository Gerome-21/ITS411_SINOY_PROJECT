import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  // Add a todo
  const addTodo = () => {
    if (text.trim()) {
      setTodos(prev => [...prev, { id: Date.now().toString(), text }]);
      setText(""); // clear input
    }
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Render a single todo
  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.text}</Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteBtn}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerome's Todo List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter todo..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
        />
        <Button title="Add" onPress={addTodo} />
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No todos yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  todoText: {
    color: "white",
    flex: 1,
  },
  deleteBtn: {
    fontSize: 18,
    color: "red",
    marginLeft: 10,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
