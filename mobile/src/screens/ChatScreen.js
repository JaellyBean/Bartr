import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { supabase } from '../utils/supabase';

export default function ChatScreen({ route, navigation }) {
  const { conversationId: initialConvId, otherUserName, otherUserId } = route.params || {};
  const [conversationId, setConversationId] = useState(initialConvId);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    let unmounted = false;
    let channel = null;

    const initializeChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      let activeConvId = conversationId;

      if (!activeConvId && otherUserId) {
        const { data: convs } = await supabase
          .from('conversations')
          .select('id, participant1_id, participant2_id')
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`);
          
        if (convs && convs.length > 0) {
          const match = convs.find(c => 
            (c.participant1_id === user.id && c.participant2_id === otherUserId) || 
            (c.participant1_id === otherUserId && c.participant2_id === user.id)
          );
          if (match) {
            activeConvId = match.id;
            if (!unmounted) setConversationId(match.id);
          }
        }
      }

      if (activeConvId) {
        await fetchMessages(activeConvId);
        
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', activeConvId)
          .neq('sender_id', user.id)
          .eq('is_read', false);

        channel = supabase.channel(`public:messages:conversation_id=eq.${activeConvId}`)
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `conversation_id=eq.${activeConvId}`
          }, payload => {
            if (!unmounted) {
              setMessages(prev => [payload.new, ...prev]);
            }
            if (payload.new.sender_id !== user.id) {
              supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id).then();
            }
          })
          .subscribe();
      } else {
        if (!unmounted) setLoading(false);
      }
    };

    initializeChat();

    return () => {
      unmounted = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async (convId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (data && !error) {
      setMessages(data);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (message.trim().length === 0) return;
    const textToSend = message;
    setMessage('');
    
    let activeConvId = conversationId;
    let fallbackConvId = false;
    
    if (!activeConvId) {
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({ participant1_id: currentUserId, participant2_id: otherUserId })
        .select()
        .single();
        
      if (error || !newConv) return;
      activeConvId = newConv.id;
      setConversationId(newConv.id);
      fallbackConvId = true;
    }

    const { error: msgError } = await supabase
      .from('messages')
      .insert({ conversation_id: activeConvId, sender_id: currentUserId, content: textToSend });
      
    if (msgError) console.error("Message error:", msgError);
    if (fallbackConvId) {
      fetchMessages(activeConvId);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender_id === currentUserId;
    const timeObj = new Date(item.created_at);
    const isToday = timeObj.toDateString() === new Date().toDateString();
    const formattedTime = isToday 
      ? timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : timeObj.toLocaleDateString();

    return (
      <View style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageThem]}>
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>{item.content}</Text>
        <Text style={styles.messageTime}>{formattedTime}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUserName || 'User'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}><ActivityIndicator color="#4f46e5"/></View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          inverted={true}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor="#6b7280"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageThem: {
    backgroundColor: '#1f2937',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageMe: {
    backgroundColor: '#4f46e5',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTextThem: {
    color: '#fff',
  },
  messageTextMe: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    backgroundColor: '#030712',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
