import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { Dog, Heart, Phone, MessageCircle, ArrowLeft, Sparkles, ShieldCheck, Instagram } from "lucide-react";
import { CONTACT_INFO } from "@/src/constants";
import { useState, useEffect } from "react";
import { db } from "@/src/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Puppy } from "@/src/types";

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

export default function PuppyDetail() {
  const { id } = useParams();
  const [puppy, setPuppy] = useState<Puppy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const path = `puppies/${id}`;
    
    const unsubscribe = onSnapshot(doc(db, 'puppies', id), (docSnap) => {
      if (docSnap.exists()) {
        setPuppy({ id: docSnap.id, ...docSnap.data() } as Puppy);
      } else {
        setPuppy(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!puppy) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">아이를 찾을 수 없습니다.</h1>
        <Link to="/puppies" className="text-amber-600 font-bold hover:underline">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-16">
      {/* Back Button */}
      <Link to="/puppies" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-amber-600 transition-all">
        <ArrowLeft className="w-5 h-5" />
        목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50"
          >
            <img
              src={puppy.images[0]}
              alt={puppy.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            {puppy.images.slice(1).map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/30"
              >
                <img
                  src={img}
                  alt={`${puppy.name} ${idx + 2}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Content */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-amber-100 text-amber-600 text-xs font-bold rounded-full uppercase tracking-widest">
                {puppy.breed}
              </span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                {puppy.status === 'available' ? '분양가능' : '분양완료'}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">{puppy.name}</h1>
            <p className="text-xl text-gray-500 leading-relaxed">{puppy.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">나이</p>
              <p className="text-xl font-bold text-gray-900">{puppy.age}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">성별</p>
              <p className="text-xl font-bold text-gray-900">{puppy.gender}</p>
            </div>
          </div>

          <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-amber-900">분양가</span>
              <span className="text-3xl font-bold text-amber-600">{puppy.price}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center justify-center gap-2 py-5 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 active:scale-95"
              >
                <Phone className="w-5 h-5" />
                전화 문의하기
              </a>
              <a
                href={`https://www.instagram.com/${CONTACT_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-5 bg-white border border-amber-200 text-amber-600 font-bold rounded-2xl hover:bg-amber-50 transition-all active:scale-95"
              >
                <Instagram className="w-5 h-5" />
                인스타그램
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">함께있어줄개만의 약속</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">건강한 아이들</p>
                  <p className="text-sm text-gray-500">전문 수의사의 검진을 마친 건강한 아이들만 분양합니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">철저한 사후관리</p>
                  <p className="text-sm text-gray-500">분양 후에도 아이들의 건강과 적응을 위해 최선을 다합니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">정직한 분양</p>
                  <p className="text-sm text-gray-500">모든 정보를 투명하게 공개하며 정직하게 상담해 드립니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
