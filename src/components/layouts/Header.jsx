import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginApi } from "../../apis/login";
import {
  categoriesState,
  categoryList,
  detailList,
  detailTypesState,
  selectedCategoryState,
  selectedDetailTypeState,
} from "../../atoms/categoryAtom";
import { loginUser } from "../../atoms/loginAtom";
import { remove_cookie } from "../../utils/Cookie";

function Header() {
  const [userInfo, setUserInfo] = useRecoilState(loginUser);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [detailTypes, setDetailTypes] = useRecoilState(detailTypesState);
  const [selectedCategory, setSelectedCategory] = useRecoilState(
    selectedCategoryState,
  );
  const [categoryDatas, setCategoryDatas] = useRecoilState(categoryList);
  const [detaileTypeDatas, setDetaileTypeDatas] = useRecoilState(detailList);
  const [selectedDetailType, setSelectedDetailType] = useRecoilState(
    selectedDetailTypeState,
  );
  const menuRef = useRef();
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState(
    "/images/order/default_profile.jpg",
  );

  const getUserInfo = async () => {
    try {
      const res = await loginApi.get(`/api/user`);

      const userData = res.data.resultData;
      const profileImgUrl = userData.pic
        ? userData.pic.startsWith("/pic")
          ? `https://job-done.r-e.kr:52340${userData.pic}`
          : `${userData.pic}`
        : "/images/order/default_profile.jpg";
      setProfileImg(profileImgUrl);
    } catch (error) {
      console.error("API 에러:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await loginApi.get(`/api/category`);
      setCategories(res.data.resultData);
      setCategoryDatas(res.data.resultData);
    } catch (error) {
      console.error("Categories error:", error.response || error);
    }
  };

  const fetchDetailTypes = async categoryId => {
    try {
      const res = await loginApi.get(`/api/category/detail`, {
        params: { categoryId: categoryId },
      });
      setDetailTypes(prev => ({
        ...prev,
        [categoryId]: res.data.resultData,
      }));
      setDetaileTypeDatas(prev => ({
        ...prev,
        [categoryId]: res.data.resultData,
      }));
    } catch (error) {
      console.error(categoryId, ":", error.response?.data || error.message);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    setUserInfo({
      accessToken: "",
      isLogind: false,
    });
    navigate("/");
  };

  const handleCategoryClick = categoryId => {
    setSelectedCategory(categoryId);
    setSelectedDetailType(null);
    navigate(`/service?categoryId=${categoryId}`);
  };

  const handleDetailTypeClick = (categoryId, detailTypeId) => {
    setSelectedCategory(categoryId);

    setSelectedDetailType(detailTypeId);
    navigate(`/service?categoryId=${categoryId}&detailTypeId=${detailTypeId}`);
  };

  const getBusinessId = Number(localStorage.getItem("businessId"));

  useEffect(() => {
    const getCookie = name => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const storedToken =
      getCookie("accessToken") || localStorage.getItem("accessToken");

    if (storedToken) {
      setUserInfo(prev => ({
        ...prev,
        accessToken: storedToken,
        isLogind: true,
      }));

      getUserInfo();
    }
  }, []);

  useEffect(() => {
    // console.log("선택된 카테고리:", selectedCategory);
    setSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // console.log("선택된 디테일 타입:", selectedDetailType);
    setSelectedDetailType(selectedDetailType);
  }, [selectedDetailType]);

  useEffect(() => {
    fetchCategories();
    // console.log("카테고리 데이터:", categories);
  }, []);

  useEffect(() => {
    categories.forEach(category => {
      fetchDetailTypes(category.categoryId);
    });
  }, [categories]);

  const handleClickOutside = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMainMenuOpen(false);
      setIsProfileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="bg-white z-50 fixed flex items-center h-[80px] w-[100%] m-auto border-b-[1px] border-solid border-[#eee] px-[20px]">
      <div className="flex justify-between items-center h-20 max-w-[1280px] w-[100%] m-auto">
        {/* 메뉴버튼 */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <img src="/images/logo.svg" alt="logo" />
          </div>

          <ul className="md-2-munus:hidden flex pl-[30px] gap-10 text-[20px] items-center text-[#1E1E1E]">
            {categories.map(category => (
              <li key={category.categoryId} className="relative group">
                <button
                  className="hover:text-[#0B7493] py-2"
                  onClick={() => handleCategoryClick(category.categoryId)}
                >
                  {category.categoryName}
                </button>
                <div className="absolute hidden group-hover:block w-auto pt-2">
                  <div className="bg-white shadow-md rounded-lg flex flex-col whitespace-nowrap">
                    {detailTypes[category.categoryId]?.map(detailType => (
                      <button
                        key={detailType.detailTypeId}
                        className="block px-6 py-3 hover:bg-gray-100 text-[16px] text-left"
                        onClick={() =>
                          handleDetailTypeClick(
                            category.categoryId,
                            detailType.detailTypeId,
                          )
                        }
                      >
                        {detailType.detailTypeName}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isMainMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 w-full bg-white shadow-lg">
            <ul className="flex flex-col">
              {categories.map(category => (
                <li key={category.categoryId} className="border-b">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-100"
                    onClick={() => handleCategoryClick(category.categoryId)}
                  >
                    {category.categoryName}
                  </button>
                  {detailTypes[category.categoryId]?.map(detailType => (
                    <button
                      key={detailType.detailTypeId}
                      className="block w-full px-8 py-2 hover:bg-gray-100 text-sm text-left"
                      onClick={() =>
                        handleDetailTypeClick(
                          category.categoryId,
                          detailType.detailTypeId,
                        )
                      }
                    >
                      {detailType.detailTypeName}
                    </button>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          {userInfo.isLogind ? (
            // 로그인 상태
            <>
              <Link
                to="/forum"
                className="flex items-center justify-center md-2-munus:hidden"
              >
                고객센터
              </Link>
              {getBusinessId == 0 ? (
                <Link
                  to="/business/number"
                  className="bg-[#C3EEFB] text-[#0B7493] w-20 h-7 flex md-2-munus:hidden items-center justify-center rounded-2xl"
                >
                  업체 등록
                </Link>
              ) : (
                <Link
                  to="/expert"
                  className="bg-[#C3EEFB] text-[#0B7493] w-20 h-7 flex items-center justify-center rounded-2xl"
                >
                  비즈니스
                </Link>
              )}

              <Link
                to="/mypage/reservation"
                className="flex items-center justify-center md-minus:hidden"
              >
                예약현황
              </Link>
              <Link
                to="/mypage/wishlist"
                className="flex items-center justify-center md-minus:hidden"
              >
                찜
              </Link>
              <Link
                to="/mypage/message"
                className="flex items-center justify-center md-minus:hidden"
              >
                메시지
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-8 h-8 md-2-munus:w-12 md-2-munus:h-12 !rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <img
                    src={profileImg}
                    alt="프로필이미지"
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
                {/* 프로필 */}
                {isProfileMenuOpen && (
                  <div className="absolute flex flex-col items-center justify-center right-0 mt-2 w-[100px] bg-white rounded-lg shadow-lg py-2">
                    <Link
                      to="/mypage"
                      className="block px-4 py-2 text-[#1e1e1e] hover:bg-gray-100"
                    >
                      마이페이지
                    </Link>
                    <Link
                      to="/mypage/usage"
                      className="block px-4 py-2 text-[#1e1e1e] hover:bg-gray-100"
                    >
                      이용내역
                    </Link>
                    <Link
                      to="/mypage/review"
                      className="block px-4 py-2 text-[#1e1e1e] hover:bg-gray-100"
                    >
                      작성한 리뷰
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        remove_cookie("refreshToken");
                      }}
                      className="block w-full  px-4 py-2 text-[#1e1e1e] hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // 로그아웃 상태
            <>
              <Link
                to="/forum"
                className="flex items-center justify-center  md-2-munus:hidden"
              >
                고객센터
              </Link>
              <Link
                to="/login"
                className="bg-[#C3EEFB] text-[#0B7493] w-20 h-7 flex  md-2-munus:hidden items-center justify-center rounded-2xl"
              >
                업체 등록
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center md-2-munus:rounded-full md-2-munus:bg-[#C3EEFB] md-2-munus:text-[#0B7493] md-2-munus:w-[140px] md-2-munus:h-[40px]"
              >
                로그인 및 회원가입
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="h-[1px] w-auto bg-[#E8E8E8]"></div>
    </div>
  );
}
export default Header;
