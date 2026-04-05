import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Search, Dog, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { BREEDS } from "@/src/constants";
import { db } from "@/src/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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
  // You could also show a toast or alert here
}

export default function PuppyList() {
  const [selectedBreed, setSelectedBreed] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'puppies';
    const q = query(collection(db, path), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const puppyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Puppy[];
      setPuppies(puppyData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPuppies = puppies.filter(p => {
    const matchesBreed = selectedBreed === "전체" || p.breed === selectedBreed;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBreed && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-16">
      {/* Header */}
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          새로운 가족을 기다리는 아이들
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          건강하고 사랑스러운 아이들이 좋은 가족을 기다리고 있어요. 
          원하시는 견종이나 특징이 있다면 편하게 문의주세요.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {["전체", ...BREEDS].map((breed) => (
            <button
              key={breed}
              onClick={() => setSelectedBreed(breed)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                selectedBreed === breed
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-200 hover:text-amber-600"
              }`}
            >
              {breed}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="아이 이름이나 견종 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Puppy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredPuppies.map((puppy, idx) => (
          <motion.div
            key={puppy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all"
          >
            <Link to={`/puppies/${puppy.id}`}>
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/puppy${puppy.id}/800/1000`}
                  alt={puppy.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                  puppy.status === 'available' 
                    ? "bg-amber-600/90 text-white" 
                    : "bg-gray-900/80 text-white"
                }`}>
                  {puppy.status === 'available' ? '분양가능' : '분양완료'}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest">
                    <Dog className="w-3 h-3" />
                    {puppy.breed}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">{puppy.name}</h4>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{puppy.age} · {puppy.gender}</p>
                    <p className="text-lg font-bold text-gray-900">{puppy.price}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredPuppies.length === 0 && (
        <div className="py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Dog className="w-10 h-10" />
          </div>
          <p className="text-gray-500 font-medium">검색 결과가 없습니다. 다른 검색어를 입력해보세요.</p>
        </div>
      )}
    </div>
  );
}
