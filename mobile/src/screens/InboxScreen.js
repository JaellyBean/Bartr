import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../utils/supabase';

export default function InboxScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchConversations();
    
    // Subscribe to messages changes
    const channel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    const { data, error } = await supabase
      .from('user_inbox')
      .select('*')
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order('last_message_time', { ascending: false });

    if (!error && data) {
      const formatted = data.map(conv => {
        const isParticipant1 = conv.participant1_id === user.id;
        const otherName = isParticipant1 ? conv.p2_name : conv.p1_name;
        const otherId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
        
        const unread = (conv.last_message_sender_id !== user.id && conv.last_message_read === false) ? 1 : 0;
        
        let timeString = '';
        if (conv.last_message_time) {
          const date = new Date(conv.last_message_time);
          timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id: conv.conversation_id,
          otherUserId: otherId,
          user: otherName || 'Unknown User',
          lastMessage: conv.last_message || 'No messages yet',
          time: timeString,
          unread: unread
        };
      });
      setConversations(formatted);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatRow}
      onPress={() => navigation.navigate('Chat', { 
        conversationId: item.id, 
        otherUserName: item.user, 
        otherUserId: item.otherUserId 
      })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.user[0]}</Text>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{marginTop: 40}} color="#4f46e5" />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    paddingTop: 8,
  },
  chatRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#6b7280',
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: '#9ca3af',
    fontSize: 14,
    flex: 1,
    paddingRight: 16,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
