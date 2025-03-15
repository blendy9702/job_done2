import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { EventBanner } from "../components/ServiceIcon";
import { ServiceSkeleton } from "../components/ServiceSkeleton";
import anime from "animejs";
import { BusinessItem, Region } from "../types/TypeBox";
import { fetchWeather } from "../components/weather/Weather";
import { WeatherDisplayItem, WeatherItem } from "../types/TypeBox";

const Index = () => {
  const [companies] = useState<BusinessItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number>(1);
  const [TopLayoutVisible, setTopLayoutVisible] = useState<boolean>(false);
  const BASE_URL = "http://112.222.157.157:5234";
  const [weatherItems, setWeatherItems] = useState<WeatherDisplayItem[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherItem | null>(
    null,
  );
  const [logo, setLogo] = useState<BusinessItem[]>([]);

  const LOGO_URL = "http://112.222.157.157:5234";

  const justWantLogo = async () => {
    try {
      const res = await axios.get("/api/business");
      console.log("로고", res.data.resultData);
      if (
        Array.isArray(res.data.resultData) &&
        res.data.resultData.length > 0
      ) {
        setLogo(res.data.resultData);
      } else {
        setLogo([]);
      }
    } catch (error) {
      console.log(error);
      setLogo([]);
    }
  };

  useEffect(() => {
    justWantLogo();
  }, []);

  // 지역 스크롤 레이아웃

  const LetTopLayout = () => {
    return (
      <div
        className={`bg-[#1e1e1e] backdrop-blur-sm py-4 fixed top-[80px] left-0 w-full z-50 ${TopLayoutVisible ? "block" : "hidden"}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">JobDone</h1>
          <nav className="flex gap-6 justify-center items-center">
            {regions.map(region => (
              <button
                key={region.regionId}
                onClick={() => setSelectedRegion(region.regionId)}
                className={`text-[16px] font-medium ${
                  selectedRegion === region.regionId
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                } transition-colors`}
              >
                {region.region}
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  // 지역 이름

  const regionNames: { [key: number]: string } = {
    1: "대구",
    2: "구미",
    3: "경주",
    4: "포항",
    5: "부산",
  };

  const [regions] = useState<Region[]>(
    Array.from({ length: 5 }, (_, i) => ({
      regionId: i + 1,
      region: regionNames[i + 1],
    })),
  );

  const fetchBusinessData = async (
    regionId: number,
    sortType: string,
  ): Promise<BusinessItem[]> => {
    const response = await axios.get("/api/business", {
      params: {
        regionId,
        sortType,
      },
    });
    return response.data.resultData;
  };

  const { data: popularData } = useQuery<BusinessItem[]>({
    queryKey: ["business", selectedRegion, "인기순"],
    queryFn: () => fetchBusinessData(selectedRegion, "인기순"),
  });

  const { data: latestData } = useQuery<BusinessItem[]>({
    queryKey: ["business", selectedRegion, "최신순"],
    queryFn: () => fetchBusinessData(selectedRegion, "최신순"),
  });

  const { data: cheapestData } = useQuery<BusinessItem[]>({
    queryKey: ["business", selectedRegion, "저가순"],
    queryFn: () => fetchBusinessData(selectedRegion, "저가순"),
  });

  const categories: {
    popular: BusinessItem[];
    latest: BusinessItem[];
    cheapest: BusinessItem[];
  } = {
    popular: popularData || [],
    latest: latestData || [],
    cheapest: cheapestData || [],
  };

  const linkRef = useRef<HTMLAnchorElement>(null);
  const roundLogRef = useRef<HTMLSpanElement>(null);
  const totalUser = 74643;

  const totalUserAnime = () => {
    if (roundLogRef.current) {
      anime({
        targets: roundLogRef.current,
        innerHTML: [0, totalUser.toLocaleString()],
        easing: "linear",
        round: 1,
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    fetchWeather("daegu", setWeatherItems, setCurrentDate, setCurrentWeather);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 750) {
        setTopLayoutVisible(true);
      } else {
        setTopLayoutVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 2700) {
        totalUserAnime();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const linkElement = linkRef.current;
    if (linkElement) {
      const handleMouseEnter = () => {
        anime({
          targets: linkElement.querySelector(".link-text"),
          translateX: 100,
        });
      };

      const handleMouseLeave = () => {
        anime({
          targets: linkElement.querySelector(".link-text"),
          translateX: 0,
        });
      };

      linkElement.addEventListener("mouseenter", handleMouseEnter);
      linkElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        linkElement.removeEventListener("mouseenter", handleMouseEnter);
        linkElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  useEffect(() => {
    // console.log("추천 글 상태 업데이트:", companies);
  }, [companies]);

  return (
    <div className="min-h-screen">
      {/* 스크롤 800px 추가 레이아웃 */}
      {LetTopLayout()}

      <div>
        {/* 이벤트 배너 */}
        <div className="relative h-[500px] overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 5000 }}
            loop={true}
            className="h-full"
          >
            {EventBanner.map(item => (
              <SwiperSlide key={item.id}>
                <Link to={item.link} className="block h-full relative">
                  <img
                    src={item.image}
                    alt="이벤트배너"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-6xl font-bold text-white text-center max-w-4xl">
                      {item.title}
                    </h2>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 지역 아이콘 */}
        <div className="bg-white/50 backdrop-blur-sm">
          <div className="flex justify-center items-center py-[80px]">
            <div className="flex gap-8">
              {regions.map(region => (
                <a
                  key={region.regionId}
                  onClick={e => {
                    e.preventDefault();
                    setSelectedRegion(region.regionId);
                  }}
                  href={`/?region=${region.regionId}`}
                  className={`h-[120px] w-[120px] rounded-2xl relative group overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-2
                    ${
                      selectedRegion === region.regionId
                        ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30"
                        : "bg-white shadow-lg hover:shadow-xl"
                    }`}
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-2xl text-[22px] font-bold transition-colors
                    ${selectedRegion === region.regionId ? "text-white" : "text-gray-700"}`}
                  >
                    {region.region}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 날씨 */}
      <div className="h-[200px]">
        <div className="flex flex-col gap-[10px] max-w-[1100px] mx-auto px-4">
          <span className="flex justify-center text-[18px] font-bold mb-[20px]">
            이번 주 날씨
          </span>
          <div className="flex mx-auto gap-[20px]" id="weather-container">
            {weatherItems.map(item => (
              <div
                key={item.date}
                className="flex flex-col items-center justify-center"
              >
                <div className="text-[18px] font-semibold">
                  {item.averageTemp}°C
                </div>
                <img src={item.iconUrl} alt="날씨 아이콘" />
                <div className="text-[16px] font-semibold">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="bg-white/30 backdrop-blur-sm py-10">
        <div className="max-w-[1280px] m-auto">
          {/* 인기 글 */}
          <div className="flex mb-[80px]">
            <div className="py-[20px]">
              <div className="flex flex-col justify-center items-center w-[200px] h-[400px] mx-4">
                <span className="text-[28px] font-bold text-[#e74964]">
                  현재 인기
                </span>
                <br />
                <span className="text-[20px] font-medium">서비스</span>
              </div>
            </div>
            {categories.popular && categories.popular.length > 0 ? (
              <Swiper
                modules={[Pagination]}
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                  dynamicMainBullets: 3,
                }}
                slidesPerView={4}
                spaceBetween={15}
                className="py-[20px] [&_.swiper-pagination]:bottom-0 [&_.swiper-pagination-bullet]:w-[25px] [&_.swiper-pagination-bullet]:h-[5px] [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:mx-1"
              >
                {categories.popular.map((item, index) => (
                  <SwiperSlide key={`popular-${item.businessId}-${index}`}>
                    <Link
                      to={`/service/${item.businessId}`}
                      className="flex flex-col rounded-xl w-full gap-[10px] relative group overflow-hidden bg-white p-[10px] shadow-lg hover:shadow-xl transition-all duration-100 hover:-translate-y-1 h-[400px]"
                    >
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden">
                        <img
                          src={`${BASE_URL}${item.pic}`}
                          alt="사진"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="block w-full overflow-hidden font-medium text-lg line-clamp-2">
                        {item.title}
                      </span>
                      <div className="mt-auto">
                        <span className="text-[20px] font-bold text-blue-600 block truncate">
                          {item.price.toLocaleString()}원~
                        </span>
                        <div className="flex justify-between text-[15px] items-center">
                          <span className="text-gray-600 truncate max-w-[120px]">
                            {item.businessName}
                          </span>
                          <span className="flex justify-center items-center gap-[3px] bg-gray-50 px-3 py-1 rounded-full">
                            <FaStar className="text-[#FF9D00]" />
                            <span className="font-medium">{item.scoreAvg}</span>
                            <span className="text-gray-400">{`(${item.serviceCount})`}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex w-full gap-[15px]">
                {[...Array(4)].map((_, index) => (
                  <ServiceSkeleton key={index} />
                ))}
              </div>
            )}
          </div>

          {/* 최신 글 */}
          <div className="flex mb-[80px]">
            <div className="py-[20px]">
              <div className="flex flex-col justify-center items-center w-[200px] h-[400px] mx-4">
                <span className="text-[28px] font-bold text-[#4889dd]">
                  최근 등록된
                </span>
                <br />
                <span className="text-[20px] font-medium">서비스</span>
              </div>
            </div>
            {categories.latest && categories.latest.length > 0 ? (
              <Swiper
                modules={[Pagination]}
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                  dynamicMainBullets: 3,
                }}
                slidesPerView={4}
                spaceBetween={15}
                className="py-[20px] [&_.swiper-pagination]:bottom-0 [&_.swiper-pagination-bullet]:w-[25px] [&_.swiper-pagination-bullet]:h-[5px] [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:mx-1"
              >
                {categories.latest.map((item, index) => (
                  <SwiperSlide key={`latest-${item.businessId}-${index}`}>
                    <Link
                      to={`/service/${item.businessId}`}
                      className="flex flex-col rounded-xl w-full gap-[10px] relative group overflow-hidden bg-white p-[10px] shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 h-[400px]"
                    >
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden">
                        <img
                          src={`${BASE_URL}${item.pic}`}
                          alt="사진"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="block w-full overflow-hidden font-medium text-lg line-clamp-2">
                        {item.title}
                      </span>
                      <div className="mt-auto">
                        <span className="text-[20px] font-bold text-blue-600 block truncate">
                          {item.price.toLocaleString()}원~
                        </span>
                        <div className="flex justify-between text-[15px] items-center">
                          <span className="text-gray-600 truncate max-w-[120px]">
                            {item.businessName}
                          </span>
                          <span className="flex justify-center items-center gap-[3px] bg-gray-50 px-3 py-1 rounded-full">
                            <FaStar className="text-[#FF9D00]" />
                            <span className="font-medium">{item.scoreAvg}</span>
                            <span className="text-gray-400">{`(${item.serviceCount})`}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex w-full gap-[15px]">
                {[...Array(4)].map((_, index) => (
                  <ServiceSkeleton key={index} />
                ))}
              </div>
            )}
          </div>

          {/* 최저가 글 */}
          <div className="flex mb-[80px]">
            <div className="py-[20px]">
              <div className="flex flex-col justify-center items-center w-[200px] h-[400px] mx-4">
                <span className="text-[28px] font-bold text-[#e4b041]">
                  최저가
                </span>
                <br />
                <span className="text-[20px] font-medium">서비스</span>
              </div>
            </div>
            {categories.cheapest && categories.cheapest.length > 0 ? (
              <Swiper
                modules={[Pagination]}
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                  dynamicMainBullets: 3,
                }}
                slidesPerView={4}
                spaceBetween={15}
                className="py-[20px] [&_.swiper-pagination]:bottom-0 [&_.swiper-pagination-bullet]:w-[25px] [&_.swiper-pagination-bullet]:h-[5px] [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:mx-1"
              >
                {categories.cheapest.map((item, index) => (
                  <SwiperSlide key={`cheapest-${item.businessId}-${index}`}>
                    <Link
                      to={`/service/${item.businessId}`}
                      className="flex flex-col rounded-xl w-full gap-[10px] relative group overflow-hidden bg-white p-[10px] shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 h-[400px]"
                    >
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden">
                        <img
                          src={`${BASE_URL}${item.pic}`}
                          alt="사진"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="block w-full overflow-hidden font-medium text-lg line-clamp-2">
                        {item.title}
                      </span>
                      <div className="mt-auto">
                        <span className="text-[20px] font-bold text-blue-600 block truncate">
                          {item.price.toLocaleString()}원~
                        </span>
                        <div className="flex justify-between text-[15px] items-center">
                          <span className="text-gray-600 truncate max-w-[120px]">
                            {item.businessName}
                          </span>
                          <span className="flex justify-center items-center gap-[3px] bg-gray-50 px-3 py-1 rounded-full">
                            <FaStar className="text-[#FF9D00]" />
                            <span className="font-medium">{item.scoreAvg}</span>
                            <span className="text-gray-400">{`(${item.serviceCount})`}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex w-full gap-[15px]">
                {[...Array(4)].map((_, index) => (
                  <ServiceSkeleton key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 회원가입 배너 */}
      <div className="m-auto py-[80px] bg-gradient-to-b from-[#ffffff] to-[#d6d6d6]">
        <div className="max-w-[1280px] m-auto py-[80px]">
          <div className="flex justify-center items-center">
            <Link
              to="/login"
              ref={linkRef}
              className="flex items-center justify-center w-full h-[300px] bg-gradient-to-br from-blue-500 to-purple-500 text-white text-[48px] font-bold rounded-lg shadow-lg transition-transform duration-200"
            >
              <span className="link-text">
                JOBDONE 회원가입하고 더 많은 혜택을 누리세요!
              </span>
            </Link>
          </div>
        </div>

        {/* 총 이용자 수 */}
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <span className="text-[40px] font-bold text-[#e4b041] mt-20 pt-[100px]">
              지금까지 총 이용자 수
            </span>
            <div className="text-[48px] font-bold text-[#1e1e1e] my-20">
              <span ref={roundLogRef} className="round-log">
                0
              </span>
              명
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center bg-[#d6d6d6] h-[300px]">
        <span className="text-[40px] font-bold text-[#1e1e1e]">
          믿을 수 있는 기업들이 함께 합니다.
        </span>
      </div>
      <div className="bg-gradient-to-b from-[#d6d6d6] to-[#ffffff] h-[400px] m-auto">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={10}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={500}
          className="flex justify-center items-center"
        >
          {logo.slice(0, 15).map(item => (
            <SwiperSlide key={item.businessId} style={{ userSelect: "none" }}>
              <img
                src={`${LOGO_URL}${item.logo}`}
                alt="로고"
                className="w-[100px] h-[100px] rounded-lg shadow-md pointer-events-none my-5 overflow-hidden"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={10}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            reverseDirection: true,
          }}
          speed={500}
          className="flex justify-center items-center"
        >
          {logo.slice(16, 30).map(item => (
            <SwiperSlide key={item.businessId} style={{ userSelect: "none" }}>
              <img
                src={`${LOGO_URL}${item.logo}`}
                alt="로고"
                className="w-[100px] h-[100px] rounded-lg shadow-md pointer-events-none my-5 overflow-hidden"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Index;
