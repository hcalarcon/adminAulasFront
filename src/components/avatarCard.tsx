import { View, StyleSheet } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { User } from "../types/UserType";
import { useTheme } from "@react-navigation/native";
import { getInitials } from "../utils/initials";

interface Props {
  isalarcoins: boolean;
  alarcoins: number;
  user: User;
  loading: boolean;
}

const AvatarCard = ({
  alarcoins,
  isalarcoins = false,
  user,
  loading,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.profile,
        isalarcoins && {
          backgroundColor: colors.background,
          borderRadius: 12,
          padding: 16,
          elevation: 2, // o shadow para iOS
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
        },
      ]}
    >
      <Avatar.Text
        label={getInitials(user?.nombre, user?.apellido)}
        size={64}
        style={styles.avatar}
      />
      <Text variant="titleLarge" style={styles.name}>
        {loading ? "Cargando" : `${user?.nombre} ${user?.apellido}`}
      </Text>
      {!isalarcoins && (
        <Text variant="bodySmall" style={styles.role}>
          {loading ? "cargando" : user?.is_teacher ? "Profesor" : "Alumno"}
        </Text>
      )}

      {isalarcoins && (
        <View>
          <Text variant="bodyMedium">Tus Alarcoins</Text>
          <Text variant="bodyMedium" style={{ textAlign: "center" }}>
            {alarcoins}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    marginBottom: 16,
    maxWidth: 350,
    margin: 10,
    width: "100%",
  },
  avatar: {
    backgroundColor: "#c001f5",
  },
  name: {
    marginTop: 8,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default AvatarCard;
