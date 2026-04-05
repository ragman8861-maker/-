import { motion } from "motion/react";
import { ClipboardCheck, Search, MessageCircle, Heart, Home, ShieldCheck } from "lucide-react";

export default function Process() {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "아이 선택",
      description: "홈페이지나 매장에서 마음에 드는 아이를 선택합니다.",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "상담 및 예약",
      description: "전문 상담사와 아이의 특징, 건강 상태 등에 대해 상담 후 예약을 진행합니다.",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "계약서 작성",
      description: "분양 계약서를 작성하고 건강 보장 및 사후 관리에 대한 안내를 받습니다.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "가족 맞이",
      description: "아이와 함께 행복한 반려 생활을 시작합니다.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-24">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">분양 절차 안내</h1>
        <p className="text-lg text-gray-500">함께있어줄개는 정직하고 투명한 분양 절차를 준수합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-amber-600 text-white font-bold rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/20">
              0{idx + 1}
            </div>
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-gray-500 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-[3rem] p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            아이들의 건강을 위한<br />
            <span className="text-amber-600">철저한 약속</span>
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">15일 건강 보장</p>
                <p className="text-sm text-gray-500">분양 후 15일 이내 발생하는 질병에 대해 책임지고 관리해 드립니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">평생 사후 관리</p>
                <p className="text-sm text-gray-500">아이를 키우며 궁금한 점이나 어려운 점은 언제든 상담 가능합니다.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop"
            alt="Puppy Care"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
