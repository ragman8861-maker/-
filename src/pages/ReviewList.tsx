import { motion } from "motion/react";
import { Star, Quote, Dog, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/src/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Review } from "@/src/types";

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-16">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">분양 후기</h1>
        <p className="text-lg text-gray-500">함께있어줄개에서 소중한 인연을 맺은 가족분들의 이야기입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col"
          >
            {review.image && (
              <div className="aspect-video overflow-hidden">
                <img src={review.image} alt="Review" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8 space-y-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{review.userName}님</p>
                </div>
                <Quote className="w-8 h-8 text-amber-100" />
              </div>
              
              <div className="space-y-4 flex-grow">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-600">
                  <Dog className="w-3 h-3" />
                  {review.puppyName} ({review.breed})
                </div>
                <p className="text-gray-600 leading-relaxed line-clamp-4 italic">"{review.content}"</p>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="py-24 text-center text-gray-400">
          아직 등록된 후기가 없습니다.
        </div>
      )}
    </div>
  );
}
