import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { supabase } from '../utils/supabase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyUsers();
    }
  }, [location, selectedSkill]);

  const initData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get my skills
    const { data: profile } = await supabase
      .from('profiles')
      .select('skills')
      .eq('id', user.id)
      .single();
      
    if (profile && profile.skills) {
      setMySkills(profile.skills);
    }

    // Get Location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch(e) {
        console.warn("Could not fetch location", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchNearbyUsers = async () => {
    setLoading(true);
    const radiusMeters = 50000; // 50km
    
    let params = {
      p_lat: location.latitude,
      p_lng: location.longitude,
      p_radius_meters: radiusMeters,
      p_required_skills: selectedSkill ? [selectedSkill] : null
    };

    const { data, error } = await supabase.rpc('get_nearby_users', params);
    
    if (!error && data) {
      setUsers(data);
    } else {
      console.log('Error fetching users:', error);
    }
    setLoading(false);
  };

  const renderTagFilters = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        <TouchableOpacity 
          style={[styles.filterChip, !selectedSkill && styles.filterChipActive]}
          onPress={() => setSelectedSkill(null)}
        >
          <Text style={[styles.filterText, !selectedSkill && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        
        {mySkills.map((skill, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.filterChip, selectedSkill === skill && styles.filterChipActive]}
            onPress={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
          >
            <Text style={[styles.filterText, selectedSkill === skill && styles.filterTextActive]}>{skill}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.full_name ? item.full_name[0] : 'U'}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{item.full_name || 'Anonymous User'}</Text>
          <Text style={styles.distanceText}>{(item.dist_meters / 1000).toFixed(1)} km away</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        {item.bio ? <Text style={styles.bioText}>{item.bio}</Text> : null}
        <View style={styles.skillsTagContainer}>
          {item.skills && item.skills.map((skill, i) => (
            <View key={i} style={styles.smallTag}>
              <Text style={styles.smallTagText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.tradeButton}
        onPress={() => navigation.navigate('Chat', { otherUserId: item.id, otherUserName: item.full_name })}
      >
        <Text style={styles.tradeButtonText}>Propose Trade</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>Find what you need nearby</Text>
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
              onPress={() => setViewMode('map')}
            >
              <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Map</Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderTagFilters()}
      </View>

      {loading && users.length === 0 ? (
        <ActivityIndicator style={{marginTop: 40}} color="#10b981" />
      ) : viewMode === 'map' && location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          userInterfaceStyle="dark"
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You"
            pinColor="#4f46e5"
          />
          {users.map((user) => (
            <Marker
              key={user.id}
              coordinate={{ latitude: user.lat, longitude: user.lng }}
              title={user.full_name || 'Anonymous User'}
              description={user.skills ? user.skills.join(', ') : ''}
              pinColor="#10b981"
              onCalloutPress={() => navigation.navigate('Chat', { otherUserId: user.id, otherUserName: user.full_name })}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{color: '#9ca3af', textAlign: 'center', marginTop: 40}}>
              {location ? "No users found matching these skills nearby." : "Please enable location services to find users nearby."}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  header: { paddingTop: 60, backgroundColor: '#111827', borderBottomWidth: 1, borderBottomColor: '#374151', paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9ca3af' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#1f2937', borderRadius: 8, padding: 4 },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#374151' },
  toggleText: { color: '#9ca3af', fontWeight: '600', fontSize: 14 },
  toggleTextActive: { color: '#fff' },
  filterContainer: { paddingLeft: 24 },
  filterScroll: { paddingRight: 24, gap: 8 },
  filterChip: { backgroundColor: '#1f2937', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#374151' },
  filterChipActive: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981' },
  filterText: { color: '#d1d5db', fontWeight: '500' },
  filterTextActive: { color: '#10b981', fontWeight: 'bold' },
  listContainer: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#374151' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  distanceText: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  cardBody: { marginBottom: 20, backgroundColor: '#030712', padding: 16, borderRadius: 12 },
  bioText: { color: '#d1d5db', fontSize: 14, marginBottom: 12 },
  skillsTagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  smallTag: { backgroundColor: '#1f2937', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: '#374151' },
  smallTagText: { color: '#9ca3af', fontSize: 12 },
  tradeButton: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  tradeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  map: { width: width, flex: 1 },
});
