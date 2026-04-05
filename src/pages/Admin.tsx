import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Dog, Lock, Plus, Trash2, Edit2, X, LogOut, Star, MessageSquare } from "lucide-react";
import { BREEDS } from "@/src/constants";
import { Puppy, Review } from "@/src/types";
import { db, auth } from "@/src/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from "firebase/auth";

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
  alert(`오류가 발생했습니다: ${errInfo.error}`);
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'puppies' | 'reviews'>('puppies');
  
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingPuppy, setEditingPuppy] = useState<Puppy | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const [puppyFormData, setPuppyFormData] = useState<Partial<Puppy>>({
    name: "",
    breed: "말티즈",
    age: "",
    gender: "male",
    status: "available",
    price: "상담문의",
    description: "",
    images: [],
  });

  const [reviewFormData, setReviewFormData] = useState<Partial<Review>>({
    userName: "",
    puppyName: "",
    breed: "말티즈",
    content: "",
    rating: 5,
    image: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.email !== "ragman8861@gmail.com") return;
    
    const puppyPath = 'puppies';
    const pq = query(collection(db, puppyPath), orderBy("createdAt", "desc"));
    const unsubscribePuppies = onSnapshot(pq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Puppy[];
      setPuppies(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, puppyPath);
    });

    const reviewPath = 'reviews';
    const rq = query(collection(db, reviewPath), orderBy("createdAt", "desc"));
    const unsubscribeReviews = onSnapshot(rq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, reviewPath);
    });

    return () => {
      unsubscribePuppies();
      unsubscribeReviews();
    };
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handlePuppySubmit = async (e: FormEvent) => {
    e.preventDefault();
    const path = 'puppies';
    try {
      if (editingPuppy) {
        await updateDoc(doc(db, path, editingPuppy.id), { ...puppyFormData });
      } else {
        await addDoc(collection(db, path), { ...puppyFormData, createdAt: Date.now() });
      }
      setIsAdding(false);
      setEditingPuppy(null);
      setPuppyFormData({ name: "", breed: "말티즈", age: "", gender: "male", status: "available", price: "상담문의", description: "", images: [] });
    } catch (error) {
      handleFirestoreError(error, editingPuppy ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const path = 'reviews';
    try {
      if (editingReview) {
        await updateDoc(doc(db, path, editingReview.id), { ...reviewFormData });
      } else {
        await addDoc(collection(db, path), { ...reviewFormData, createdAt: Date.now() });
      }
      setIsAdding(false);
      setEditingReview(null);
      setReviewFormData({ userName: "", puppyName: "", breed: "말티즈", content: "", rating: 5, image: "" });
    } catch (error) {
      handleFirestoreError(error, editingReview ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const handleDeletePuppy = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'puppies', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `puppies/${id}`);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${id}`);
    }
  };

  const seedReviews = async () => {
    const sampleReviews = [
      {
        userName: "김민지",
        puppyName: "초코",
        breed: "토이푸들",
        content: "처음 데려올 때 걱정이 많았는데, 사장님께서 너무 친절하게 설명해주셔서 안심이 됐어요. 초코는 지금 저희 집의 활력소예요! 건강하게 잘 크고 있습니다.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop",
        createdAt: Date.now() - 86400000 * 5
      },
      {
        userName: "이준호",
        puppyName: "두부",
        breed: "말티즈",
        content: "두부를 만난 건 정말 행운이에요. 배변 훈련도 금방 하고 너무 똑똑해요. 함께있어줄개 사장님께서 주신 관리 팁들이 정말 큰 도움이 되었습니다.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1591768793355-74d74b2607f6?q=80&w=2070&auto=format&fit=crop",
        createdAt: Date.now() - 86400000 * 10
      },
      {
        userName: "박서연",
        puppyName: "루이",
        breed: "비숑 프리제",
        content: "비숑 분양 알아보던 중에 지인 추천으로 방문했는데, 매장이 너무 깨끗해서 믿음이 갔어요. 루이는 성격도 너무 밝고 건강해요. 감사합니다!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?q=80&w=2070&auto=format&fit=crop",
        createdAt: Date.now() - 86400000 * 2
      },
      {
        userName: "최지우",
        puppyName: "뭉치",
        breed: "포메라니안",
        content: "포메는 처음 키워보는데 털 관리법부터 사료까지 꼼꼼하게 알려주셔서 큰 도움이 됐어요. 뭉치가 집에 오고 나서 분위기가 너무 밝아졌어요!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2070&auto=format&fit=crop",
        createdAt: Date.now() - 86400000 * 15
      },
      {
        userName: "정우성",
        puppyName: "까미",
        breed: "시바견",
        content: "시바견 특유의 고집이 있을까 걱정했는데, 사회화 훈련이 잘 된 아이를 데려온 것 같아요. 배변도 첫날부터 가리고 너무 기특합니다.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=2068&auto=format&fit=crop",
        createdAt: Date.now() - 86400000 * 7
      }
    ];

    try {
      for (const review of sampleReviews) {
        await addDoc(collection(db, "reviews"), review);
      }
      alert("샘플 후기가 등록되었습니다.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "reviews");
    }
  };

  const seedPuppies = async () => {
    const breeds = ["말티즈", "토이푸들", "포메라니안", "비숑 프리제", "시바견", "골든 리트리버", "웰시 코기", "요크셔 테리어", "치와와", "시츄"];
    const names = ["뭉치", "코코", "보리", "초코", "루이", "별이", "까미", "해피", "두부", "감자", "사랑", "하늘", "구름", "망고", "레오", "아리", "토리", "콩이", "마루", "단추"];
    const genders: ("male" | "female")[] = ["male", "female"];
    
    const samplePuppies = names.map((name, i) => ({
      name,
      breed: breeds[i % breeds.length],
      age: `${Math.floor(Math.random() * 3) + 2}개월`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      status: "available",
      price: `${Math.floor(Math.random() * 100) + 50}만원`,
      description: `${breeds[i % breeds.length]} 아이입니다. 건강하고 성격이 아주 밝아요. 예방접종 ${Math.floor(Math.random() * 3) + 1}차 완료되었습니다.`,
      images: [`https://picsum.photos/seed/puppy${i}/800/1000`],
      createdAt: Date.now() - (i * 3600000) // Spread out creation times
    }));

    try {
      for (const puppy of samplePuppies) {
        await addDoc(collection(db, "puppies"), puppy);
      }
      alert("20마리의 샘플 강아지 데이터가 등록되었습니다.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "puppies");
    }
  };

  const startEditPuppy = (puppy: Puppy) => {
    setEditingPuppy(puppy);
    setPuppyFormData(puppy);
    setIsAdding(true);
  };

  const startEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewFormData(review);
    setIsAdding(true);
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user || user.email !== "ragman8861@gmail.com") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center mx-auto text-amber-600">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">관리자 로그인</h1>
            <p className="text-gray-500">매장 관리를 위해 구글 계정으로 로그인해주세요.</p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-5 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Google로 로그인하기
          </button>
          {user && user.email !== "ragman8861@gmail.com" && (
            <p className="text-sm text-red-500 text-center font-medium">관리자 권한이 없는 계정입니다.</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">관리자 대시보드</h1>
          <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('puppies')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'puppies' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              강아지 관리
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              후기 관리
            </button>
          </div>
          {activeTab === 'puppies' && puppies.length === 0 && (
            <button
              onClick={seedPuppies}
              className="text-xs text-amber-600 underline hover:text-amber-700 transition-colors"
            >
              샘플 강아지 데이터 생성하기 (20마리)
            </button>
          )}
          {activeTab === 'reviews' && reviews.length === 0 && (
            <button
              onClick={seedReviews}
              className="text-xs text-amber-600 underline hover:text-amber-700 transition-colors"
            >
              샘플 후기 데이터 생성하기
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (activeTab === 'puppies') {
                setEditingPuppy(null);
                setPuppyFormData({ name: "", breed: "말티즈", age: "", gender: "male", status: "available", price: "상담문의", description: "", images: [] });
              } else {
                setEditingReview(null);
                setReviewFormData({ userName: "", puppyName: "", breed: "말티즈", content: "", rating: 5, image: "" });
              }
              setIsAdding(true);
            }}
            className="px-8 py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'puppies' ? '새 아이 등록' : '새 후기 등록'}
          </button>
          <button
            onClick={handleLogout}
            className="px-8 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-2 active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
      </div>

      {/* Forms Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'puppies' 
                  ? (editingPuppy ? "아이 정보 수정" : "새 아이 등록")
                  : (editingReview ? "후기 정보 수정" : "새 후기 등록")}
              </h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            {activeTab === 'puppies' ? (
              <form onSubmit={handlePuppySubmit}>
                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">이름</label>
                      <input
                        type="text" required
                        value={puppyFormData.name}
                        onChange={(e) => setPuppyFormData({ ...puppyFormData, name: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">견종</label>
                      <select
                        value={puppyFormData.breed}
                        onChange={(e) => setPuppyFormData({ ...puppyFormData, breed: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">나이</label>
                      <input
                        type="text"
                        value={puppyFormData.age}
                        onChange={(e) => setPuppyFormData({ ...puppyFormData, age: e.target.value })}
                        placeholder="예: 2개월"
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">성별</label>
                      <select
                        value={puppyFormData.gender}
                        onChange={(e) => setPuppyFormData({ ...puppyFormData, gender: e.target.value as any })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="male">남아</option>
                        <option value="female">여아</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">분양가</label>
                      <input
                        type="text"
                        value={puppyFormData.price}
                        onChange={(e) => setPuppyFormData({ ...puppyFormData, price: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">상태</label>
                      <select
                        value={puppyFormData.status}
                        onChange={(e) => setPuppyFormData({ ...puppyFormData, status: e.target.value as any })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="available">분양가능</option>
                        <option value="adopted">분양완료</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">설명</label>
                    <textarea
                      rows={4}
                      value={puppyFormData.description}
                      onChange={(e) => setPuppyFormData({ ...puppyFormData, description: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-600">이미지 (URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="이미지 URL을 입력하세요"
                        className="flex-grow px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              setPuppyFormData({ ...puppyFormData, images: [...(puppyFormData.images || []), val] });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {puppyFormData.images?.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setPuppyFormData({ ...puppyFormData, images: puppyFormData.images?.filter((_, idx) => idx !== i) })}
                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                  <button type="submit" className="flex-grow py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 active:scale-95">
                    {editingPuppy ? "수정완료" : "등록하기"}
                  </button>
                  <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95">
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">고객명</label>
                      <input
                        type="text" required
                        value={reviewFormData.userName}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, userName: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">아이 이름</label>
                      <input
                        type="text" required
                        value={reviewFormData.puppyName}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, puppyName: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">견종</label>
                      <select
                        value={reviewFormData.breed}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, breed: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">평점</label>
                      <select
                        value={reviewFormData.rating}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, rating: Number(e.target.value) })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r}점</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">후기 내용</label>
                    <textarea
                      rows={6} required
                      value={reviewFormData.content}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, content: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">이미지 URL</label>
                    <input
                      type="text"
                      value={reviewFormData.image}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, image: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                  <button type="submit" className="flex-grow py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 active:scale-95">
                    {editingReview ? "수정완료" : "등록하기"}
                  </button>
                  <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95">
                    취소
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'puppies' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">아이</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">견종</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">상태</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {puppies.map((puppy) => (
                  <tr key={puppy.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                          <img src={puppy.images[0] || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{puppy.name}</p>
                          <p className="text-sm text-gray-500">{puppy.age} · {puppy.gender === 'male' ? '남아' : '여아'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full">{puppy.breed}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${puppy.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {puppy.status === 'available' ? '분양가능' : '분양완료'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEditPuppy(puppy)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={() => handleDeletePuppy(puppy.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">후기</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">아이</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">평점</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                          <img src={review.image || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-bold text-gray-900">{review.userName}님</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{review.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-900">{review.puppyName}</p>
                      <p className="text-xs text-gray-500">{review.breed}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEditReview(review)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
