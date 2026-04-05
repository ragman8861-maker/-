import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Dog, Heart, ShieldCheck, Sparkles, ArrowRight, Star, Quote, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/src/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { Puppy, Review } from "@/src/types";
import { CONTACT_INFO } from "@/src/constants";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export default function Home() {
  const [latestPuppies, setLatestPuppies] = useState<Puppy[]>([]);
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      title: "사랑으로 케어",
      description: "모든 아이들은 전문 관리사의 사랑과 정성으로 건강하게 관리됩니다.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "건강 보장 제도",
      description: "분양 후에도 아이들의 건강을 위해 철저한 사후 관리 시스템을 운영합니다.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "프리미엄 환경",
      description: "아이들이 스트레스 없이 지낼 수 있는 쾌적하고 청결한 환경을 유지합니다.",
    },
  ];

  useEffect(() => {
    const puppyPath = 'puppies';
    const pq = query(collection(db, puppyPath), orderBy("createdAt", "desc"), limit(4));
    
    const unsubscribePuppies = onSnapshot(pq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Puppy[];
      setLatestPuppies(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, puppyPath);
    });

    const reviewPath = 'reviews';
    const rq = query(collection(db, reviewPath), orderBy("createdAt", "desc"), limit(3));
    const unsubscribeReviews = onSnapshot(rq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      setLatestReviews(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, reviewPath);
      setLoading(false);
    });

    return () => {
      unsubscribePuppies();
      unsubscribeReviews();
    };
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop"
            alt="Puppy Hero"
            className="w-full h-full object-cover brightness-[0.7]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 backdrop-blur-md border border-amber-400/30 rounded-full text-amber-100 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>프리미엄 강아지 분양 전문</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              소중한 가족,<br />
              <span className="text-amber-400">함께있어줄개</span>에서<br />
              만나보세요
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg">
              건강하고 사랑스러운 아이들이 새로운 가족을 기다리고 있습니다. 
              정직하고 투명한 분양 문화를 선도합니다.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/puppies"
                className="px-8 py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 hover:shadow-amber-900/30 active:scale-95 flex items-center gap-2"
              >
                분양중인 아이들 보기
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/location"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95"
              >
                매장 방문 예약
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Puppies Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              지금 만날 수 있는 아이들
            </h2>
            <p className="text-gray-500">사랑스러운 아이들이 가족을 기다리고 있어요.</p>
          </div>
          <Link
            to="/puppies"
            className="hidden sm:flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all"
          >
            전체보기 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPuppies.map((puppy, i) => (
            <motion.div
              key={puppy.id}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all"
            >
              <Link to={`/puppies/${puppy.id}`}>
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src={puppy.images[0] || `https://picsum.photos/seed/puppy${i}/800/1000`}
                    alt={puppy.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    puppy.status === 'available' ? "bg-amber-600/90 text-white" : "bg-gray-900/80 text-white"
                  }`}>
                    {puppy.status === 'available' ? '분양가능' : '분양완료'}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">{puppy.breed}</p>
                    <h4 className="text-xl font-bold text-gray-900">{puppy.name}</h4>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-sm text-gray-500">{puppy.age} · {puppy.gender === 'male' ? '남아' : '여아'}</span>
                    <span className="text-lg font-bold text-gray-900">{puppy.price}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {latestPuppies.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-gray-400">
              현재 분양 중인 아이들이 없습니다.
            </div>
          )}
        </div>

        <div className="sm:hidden pt-4">
          <Link
            to="/puppies"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl"
          >
            전체보기 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                가족이 된 아이들의 행복한 일상
              </h2>
              <p className="text-gray-500">함께있어줄개에서 인연을 맺은 분들의 소중한 후기입니다.</p>
            </div>
            <Link
              to="/reviews"
              className="hidden sm:flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all"
            >
              후기 더보기 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group"
              >
                <Quote className="absolute top-8 right-8 w-10 h-10 text-amber-50 opacity-50 group-hover:text-amber-100 transition-colors" />
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed italic line-clamp-4">
                    "{review.content}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                    {review.image && (
                      <img src={review.image} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{review.userName}님</p>
                      <p className="text-xs text-amber-600 font-bold">{review.puppyName} ({review.breed})</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {latestReviews.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center text-gray-400">
                아직 등록된 후기가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-amber-600 rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Dog className="absolute -top-12 -left-12 w-64 h-64 rotate-12" />
            <Dog className="absolute -bottom-12 -right-12 w-64 h-64 -rotate-12" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              건강한 반려견 분양,<br />
              전문가와 상담하세요
            </h2>
            <p className="text-amber-100 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              아이들의 건강 상태부터 사후 관리까지 친절하게 안내해 드립니다. 
              부담 없이 문의주세요.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="px-10 py-5 bg-white text-amber-600 font-bold rounded-2xl hover:bg-amber-50 transition-all shadow-xl shadow-amber-900/10 active:scale-95"
              >
                전화 상담하기
              </a>
              <a
                href={`https://www.instagram.com/${CONTACT_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-amber-700 text-white font-bold rounded-2xl hover:bg-amber-800 transition-all active:scale-95 flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                인스타그램
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
