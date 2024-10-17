import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  ToastAndroid,
} from "react-native";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import { COLORS } from "../../constants";

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
  userName: string;
}

interface Advertisement {
  id: string;
  type: string;
  category: string;
  subcategory: string;
  city: string;
  province: string;
  distance: string;
  description: string;
  createdAt: number;
}

interface AdvertisementDetailsProps {
  advertisementId: string;
  onBack: () => void;
}

const AdvertisementDetails: React.FC<AdvertisementDetailsProps> = ({
  advertisementId,
  onBack,
}) => {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(
    null
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [commentsToShow, setCommentsToShow] = useState<number>(5);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchAdvertisement = async () => {
      const docRef = doc(db, "advertisements", advertisementId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAdvertisement(docSnap.data() as Advertisement);
      }

      setLoading(false);
    };

    const fetchComments = async () => {
      const commentsRef = collection(
        db,
        "advertisements",
        advertisementId,
        "comments"
      );
      const q = query(commentsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchedComments = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const commentData = docSnapshot.data() as Comment;
            const userDocRef = doc(db, "users", commentData.userId);
            const userDoc = await getDoc(userDocRef);
            const userName = userDoc.exists()
              ? (userDoc.data() as { name: string }).name
              : "Anonymous";
            return { ...commentData, id: docSnapshot.id, userName };
          })
        );
        setComments(fetchedComments);
        setDisplayedComments(fetchedComments.slice(0, commentsToShow));
      });

      return unsubscribe;
    };

    fetchAdvertisement();
    fetchComments();
  }, [advertisementId, commentsToShow]);

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;

    try {
      await addDoc(
        collection(db, "advertisements", advertisementId, "comments"),
        {
          userId: currentUser?.uid,
          text: commentText,
          createdAt: new Date().getTime(),
        }
      );
      setCommentText("");
      ToastAndroid.show("Comment added successfully!", ToastAndroid.SHORT);
    } catch (error: any) {
      ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
    }
  };

  const handleShowMore = () => {
    setCommentsToShow((prev) => prev + 5);
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>{item.userName}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          {advertisement && (
            <View style={styles.advertisementContainer}>
              <Text style={styles.typeText}>{advertisement.type}</Text>
              <Text style={styles.locationText}>
                {advertisement.city}, {advertisement.province} -{" "}
                {advertisement.distance} km
              </Text>
              <Text style={styles.categoryText}>
                {advertisement.category} / {advertisement.subcategory}
              </Text>
              <Text style={styles.descriptionText}>
                {advertisement.description}
              </Text>
            </View>
          )}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <FlatList
              data={displayedComments}
              renderItem={renderCommentItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentsList}
            />
            {displayedComments.length < comments.length && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleShowMore}
              >
                <Text style={styles.showMoreText}>Show more</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addCommentSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddComment}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  advertisementContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  typeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
  },
  commentsSection: {
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  commentsList: {
    paddingBottom: 10,
  },
  commentContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  showMoreButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  showMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addCommentSection: {
    marginTop: 20,
  },
  commentInput: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdvertisementDetails;
