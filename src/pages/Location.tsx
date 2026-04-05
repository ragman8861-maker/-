import { motion } from "motion/react";
import { MapPin, Phone, MessageCircle, Clock, Bus, Car, Instagram } from "lucide-react";
import { CONTACT_INFO } from "@/src/constants";

export default function Location() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-24">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">오시는 길</h1>
        <p className="text-lg text-gray-500">함께있어줄개 매장 위치를 안내해 드립니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Map Placeholder */}
        <div className="aspect-square bg-gray-100 rounded-[3rem] overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col gap-4">
            <MapPin className="w-12 h-12" />
            <p className="font-bold">지도 서비스 준비중</p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3155.828456789!2d126.764!3d37.725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c97f77348997d%3A0x6739818818274735!2z7Jq07KCV7Jet!5e0!3m2!1sko!2skr!4v1620000000000!5m2!1sko!2skr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </div>

        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">매장 주소</h3>
                <p className="text-lg text-gray-500 leading-relaxed">{CONTACT_INFO.address}</p>
                <div className="pt-2 flex flex-col gap-1 text-sm text-gray-400">
                  <p>사업자등록번호: {CONTACT_INFO.businessRegistrationNumber}</p>
                  <p>동물판매업허가번호: {CONTACT_INFO.animalSalesLicenseNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">영업 시간</h3>
                <p className="text-lg text-gray-500 leading-relaxed">{CONTACT_INFO.businessHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <Instagram className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">인스타그램</h3>
                <a 
                  href={`https://www.instagram.com/${CONTACT_INFO.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg text-gray-500 leading-relaxed hover:text-amber-600 transition-colors"
                >
                  @{CONTACT_INFO.instagram}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">전화 번호</h3>
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-lg text-gray-500 leading-relaxed hover:text-amber-600 transition-colors">{CONTACT_INFO.phone}</a>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-8">
            <h3 className="text-xl font-bold text-gray-900">교통 안내</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Bus className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-bold text-gray-900">대중교통 이용 시</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    경의중앙선 운정역 2번 출구에서 도보 약 10분 거리입니다. 
                    운정역 인근 버스 정류장을 이용하시면 편리합니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Car className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-bold text-gray-900">자가용 이용 시</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    네비게이션에 '운정역길 303'을 검색해 주세요. 
                    매장 앞 주차 공간이 마련되어 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
