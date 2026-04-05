import { Dog, Instagram, Phone, MapPin, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/src/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Dog className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">함께있어줄개</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              사랑스러운 반려견과의 소중한 인연을 맺어드리는 프리미엄 분양 전문 샵입니다. 
              건강하고 행복한 아이들만을 엄선하여 가족의 품으로 보내드립니다.
            </p>
            <div className="flex gap-4">
              <a href={`https://instagram.com/${CONTACT_INFO.instagram}`} className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-amber-600 hover:border-amber-200 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-amber-600 hover:border-amber-200 transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">바로가기</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-sm text-gray-500 hover:text-amber-600 transition-colors">홈</a></li>
              <li><a href="/puppies" className="text-sm text-gray-500 hover:text-amber-600 transition-colors">분양중인 아이들</a></li>
              <li><a href="/process" className="text-sm text-gray-500 hover:text-amber-600 transition-colors">분양 절차</a></li>
              <li><a href="/location" className="text-sm text-gray-500 hover:text-amber-600 transition-colors">오시는 길</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">고객센터</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">대표 번호</p>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-sm text-gray-500 hover:text-amber-600 transition-colors">{CONTACT_INFO.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">매장 위치</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{CONTACT_INFO.address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">카카오톡 상담</p>
                    <p className="text-sm text-gray-500">ID: {CONTACT_INFO.kakaoId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">인스타그램</p>
                    <a 
                      href={`https://www.instagram.com/${CONTACT_INFO.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      @{CONTACT_INFO.instagram}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">영업 시간</p>
                  <p className="text-sm text-gray-500">{CONTACT_INFO.businessHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center space-y-2">
          <p className="text-xs text-gray-400">
            © 2026 함께있어줄개. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            사업자등록번호: {CONTACT_INFO.businessRegistrationNumber} | 동물판매업허가번호: {CONTACT_INFO.animalSalesLicenseNumber}
          </p>
        </div>
      </div>
    </footer>
  );
}
