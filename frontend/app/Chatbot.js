import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal
} from "react-native";

export default function Chatbot() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    // User message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    // Bot reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: `You said: ${input}` }
      ]);
    }, 600);

    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.fabText}>💬</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.chatWindow}>
            <View style={styles.header}>
              <Text style={styles.headerText}>AI Chatbot</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeBtn}>✖</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.messagesContainer}>
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.message,
                    msg.sender === "user" ? styles.userMessage : styles.botMessage
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5
  },
  fabText: {
    fontSize: 28,
    color: "#fff"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end"
  },
  chatWindow: {
    backgroundColor: "#fff",
    height: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#007AFF"
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  closeBtn: {
    color: "#fff",
    fontSize: 18
  },
  messagesContainer: {
    flex: 1,
    padding: 10
  },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%"
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end"
  },
  botMessage: {
    backgroundColor: "#F1F0F0",
    alignSelf: "flex-start"
  },
  messageText: {
    fontSize: 16
  },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 8
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  sendText: {
    color: "#fff",
    fontSize: 18
  }
});
