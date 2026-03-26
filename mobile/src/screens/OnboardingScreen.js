import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { supabase } from "../utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";

export default function OnboardingScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSkillInput = (text) => {
    if (text.endsWith(",")) {
      const newSkill = text.slice(0, -1).trim();
      if (newSkill.length > 0 && !skillsList.includes(newSkill)) {
        setSkillsList([...skillsList, newSkill]);
      }
      setCurrentSkill("");
    } else {
      setCurrentSkill(text);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleSave = async () => {
    if (!bio.trim() || skillsList.length === 0 || !fullName.trim()) {
      Alert.alert(
        "Almost there",
        "Please add your full name, a short bio, and at least one skill.",
      );
      return;
    }

    setIsLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsLoading(false);
      Alert.alert("Error", "Unable to fetch user session.");
      return;
    }

    let locationPoint = null;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        // PostGIS uses Longitude Latitude (X Y)
        locationPoint = `POINT(${loc.coords.longitude} ${loc.coords.latitude})`;
      }
    } catch (e) {
      console.log("Location error:", e);
    }

    const updates = {
      id: user.id,
      bio,
      skills: skillsList,
      full_name: fullName.trim(),
      onboarding_completed: true,
    };

    if (locationPoint) {
      updates.location = locationPoint;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(updates, { onConflict: "id", returning: "minimal" });

    setIsLoading(false);

    if (error) {
      Alert.alert("Error updating profile", error.message);
    } else {
      navigation.replace("Home");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <LinearGradient
        colors={["rgba(16, 185, 129, 0.15)", "#030712"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.header}>
            <LinearGradient
              colors={["#10b981", "#059669"]}
              style={styles.logoContainer}
            >
              <Text style={styles.logoText}>✓</Text>
            </LinearGradient>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              Let the community know what you offer
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Jane Doe"
              placeholderTextColor="#6b7280"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Short Bio</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="I'm a local mechanic who loves fixing up vintage cars..."
              placeholderTextColor="#6b7280"
              multiline
              value={bio}
              onChangeText={setBio}
            />

            <Text style={styles.label}>Your Skills (type and press comma)</Text>
            <View style={styles.skillsInputContainer}>
              <View style={styles.tagsContainer}>
                {skillsList.map((skill, index) => (
                  <View key={index} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(skill)}>
                      <Text style={styles.tagRemove}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    marginBottom: 0,
                    borderWidth: 0,
                    paddingHorizontal: 0,
                    backgroundColor: "transparent",
                  },
                ]}
                placeholder="Graphic Design, Plumbing..."
                placeholderTextColor="#6b7280"
                value={currentSkill}
                onChangeText={handleSkillInput}
                onSubmitEditing={() => handleSkillInput(currentSkill + ",")}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Finish Setup</Text>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderColor: "rgba(55, 65, 81, 0.5)",
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  label: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  skillsInputContainer: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.5)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    marginRight: 8,
  },
  tagText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  tagRemove: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
