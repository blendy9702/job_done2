import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import BusinessNumber from "./pages/auth/business/BusinessNumber";
import BusinessSignUp from "./pages/auth/business/Index";
import EmailPage from "./pages/auth/login/EmailPage";
import LoginPage from "./pages/auth/login/Index";
import PasswordEdit from "./pages/auth/login/PasswordEdit";
import PasswordEmail from "./pages/auth/login/PasswordEmail";
import PasswordEmailCheck from "./pages/auth/login/PasswordEmailCheck";
import SignUpDone from "./pages/auth/login/SignUpDone";
import SignUpPage from "./pages/auth/login/SignUpPage";
import MyPage from "./pages/mypage/Index";
import MyMessage from "./pages/mypage/MyMessage";
import MyReservation from "./pages/mypage/MyReservation";
import ReviewPage from "./pages/mypage/ReviewPage";
import UsageDetails from "./pages/mypage/UsageDetails";
import Wishlist from "./pages/mypage/Wishlist";

import ExpertMain from "./pages/expert/ExpertMain";

import NotFound from "./pages/NotFound";

// 서비스페이지 (업체리스트/업체디테일)
// import CarWashPage from "./pages/servicepage/carwash/Index";
// import CleaningPage from "./pages/servicepage/cleaning/Index";
import Detail from "./pages/servicepage/Detail";
import Service from "./pages/servicepage/Index";
// 예약페이지
import Reservation from "./pages/reservation/Index";
import ReservationHistory from "./pages/reservation/ReservationHistory";

// --- 전문가 페이지
import ExportLayout from "./components/ExpertLayout";
// 업체관리
import CompanyInfo from "./pages/expert/company-management/CompanyInfo";
import EditCompanyInfo from "./pages/expert/company-management/EditCompanyInfo";
import EditDetailPage from "./pages/expert/company-management/EditDetailPage";
import ExpertDetailPage from "./pages/expert/company-management/ExpertDetailPage";
import ExpertPaymentHistory from "./pages/expert/company-management/ExpertPaymentHistory";
import Portfolio from "./pages/expert/company-management/Portfolio";
// 예약관리
import ReservationList from "./pages/expert/reservation-management/Index";
// 견적관리
import EditQuotation from "./pages/expert/quote-management/EditQuotation";
import QuoteList from "./pages/expert/quote-management/Index";
import QuotationForm from "./pages/expert/quote-management/QuotationForm";
// 결제관리
import PaymentList from "./pages/expert/payment-management/Index";
// 일정관리 - 3차
import ScheduleList from "./pages/expert/schedule-management/Index";
// 고객문의

// 리뷰센터
import ReviewCenter from "./pages/expert/review-center/ReviewCenter";
// 통계
import TestPage from "./TestPage";
import PaymentFailed from "./components/PaymentFailed";
import PaymentSuccess from "./components/PaymentSuccess";
import ScrollToTop from "./components/ScrollToTop";
import Estimate from "./components/papers/Estimate";
import PaymentHistory from "./components/papers/PaymentHistory";
import Qna from "./pages/Qna";
import ReviewView from "./pages/expert/review-center/ReviewView";
import Statistics from "./pages/expert/statistics/Index";
import TestMessage from "./pages/mypage/TestMessage";
import UserReservLook from "./pages/mypage/UserReservLook";
import ContactUs from "./pages/servicepage/ContactUs";

import Maptest from "./Maptest";
import AdminLayout from "./components/admin/AdminLayout";
import AdminBusinessInfo from "./components/admin/admin-business-info/AdminBusinessInfo";
import JobDoneHistory from "./components/papers/JobDoneHistory";
import AlertTestPage from "./pages/AlertTestPage";
import OCRUploader from "./pages/OCRUploader";
import TestSpinner from "./pages/TestSpinner";
import AdminMain from "./pages/admin/AdminMain";
import CategorySearch from "./pages/admin/business-search/category-search/CategorySearch";
import ReservationSearch from "./pages/admin/business-search/reservation-search/ReservationSearch";
import RevenueSearch from "./pages/admin/business-search/revenue-search/RevenueSearch";
import RequestBusi from "./pages/admin/request/business/RequestBusi";
import UserOneByOne from "./pages/admin/user/onebyone/UserOneByOne";
import UserReport from "./pages/admin/user/report/UserReport";
import UserList from "./pages/admin/user/userlist/UserList";
import OAuth2Handler from "./pages/auth/login/OAuth2Handler";
import Forum from "./pages/community/Forum";
import QaDetail from "./pages/community/QaDetail";
import Write from "./pages/community/Write";
import CreateDetailPage from "./pages/expert/company-management/CreateDetailPage";
import CreateOptionPage from "./pages/expert/company-management/CreateOptionPage";
import EditOptionPage from "./pages/expert/company-management/EditOptionPage";
import MessageCenter from "./pages/expert/message-center/MessageCenter";
import UserStatisitcs from "./pages/expert/statistics/UserStatisitcs";

import ExpertEstimate from "./components/papers/ExpertEstimate";
import WeatherTest from "./pages/WeatherTest";
import AdDaysUser from "./pages/admin/statistics/AdDaysUser";
import AdMonth from "./pages/admin/statistics/AdMonth";
import KaKaoMaps from "./pages/kakaomap/KaKaoMaps";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/map" element={<Maptest />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/fe/redirect" element={<OAuth2Handler />} />
        <Route path="/test-spinner" element={<TestSpinner />} />
        <Route path="/alerttest" element={<AlertTestPage />} />
        <Route path="/weathertest" element={<WeatherTest />} />
        <Route path="/kakaomap2" element={<KaKaoMaps />} />
        <Route element={<Layout />}>
          <Route path="/ocr" element={<OCRUploader />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/testmessage" element={<TestMessage />} />
          {/* 커뮤니티 */}
          <Route path="forum">
            <Route index element={<Forum />} />
            <Route path="write" element={<Write />} />
            <Route path="detail/:qaId" element={<QaDetail />} />
          </Route>
          {/* 카카오페이 관련 */}
          <Route path="/paySuccess" element={<PaymentSuccess />} />
          <Route path="/payFailed" element={<PaymentFailed />} />
          {/* QnA */}
          <Route path="/qna" element={<Qna />} />
          {/* 메인 페이지 */}
          <Route path="/" element={<Index />} />
          {/* 로그인 및 회원가입 */}
          <Route path="/login">
            <Route index element={<LoginPage />} />

            <Route path="signup" element={<SignUpPage />} />
            <Route path="email" element={<EmailPage />} />
            <Route path="signupdone" element={<SignUpDone />} />
            <Route path="epwcheck" element={<PasswordEmail />} />
            <Route path="epw" element={<PasswordEmailCheck />} />
            <Route path="epwedit" element={<PasswordEdit />} />
          </Route>
          {/* 사업자 등록*/}
          <Route path="/business">
            <Route index element={<BusinessSignUp />} />
            <Route path="number" element={<BusinessNumber />} />
          </Route>
          {/* 예약페이지 */}
          <Route path="/reservation">
            <Route index element={<Reservation />} />
            <Route path="history" element={<ReservationHistory />} />
          </Route>
          {/* 서비스 페이지 */}
          <Route path="/service">
            <Route index element={<Service />} />
            <Route path=":id" element={<Detail />} />
          </Route>
          {/* 마이페이지 */}
          <Route path="/mypage">
            <Route index element={<MyPage />} />
            <Route path="message" element={<MyMessage />} />
            <Route path="reservation" element={<MyReservation />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="usage" element={<UsageDetails />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
          <Route path="/estimate/:serviceId" element={<Estimate />} />
          <Route
            path="/paymenthistory/:serviceId"
            element={<PaymentHistory />}
          />
          <Route
            path="/jobdonehistory/:serviceId"
            element={<JobDoneHistory />}
          />
          <Route
            path="/UserReservLook/:serviceId"
            element={<UserReservLook />}
          />
        </Route>
        {/* ----- 전문가 페이지 ----- */}
        <Route element={<ExportLayout />}>
          <Route path="/expert">
            {/* 관리자 */}
            <Route index element={<ExpertMain />} />
            {/* 업체관리 */}
            <Route path="/expert/company-management">
              <Route index element={<CompanyInfo />} />
              <Route path="edit" element={<EditCompanyInfo />} />
              <Route path="editdetail" element={<EditDetailPage />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="detail" element={<ExpertDetailPage />} />
              <Route path="createoption" element={<CreateOptionPage />} />
              <Route path="editoption" element={<EditOptionPage />} />
              <Route path="createdetail" element={<CreateDetailPage />} />

              <Route
                path="paymenthistory/:serviceId"
                element={<ExpertPaymentHistory />}
              />
            </Route>
            {/* 예약관리 */}
            <Route path="/expert/reservation-management">
              <Route index element={<ReservationList />} />
            </Route>
            {/* 견적관리 */}
            <Route path="/expert/quote-management">
              <Route index element={<QuoteList />} />
              <Route path="quotation-form" element={<QuotationForm />} />
              <Route path="edit-quotation" element={<EditQuotation />} />
              <Route path="estimate/:serviceId" element={<ExpertEstimate />} />
            </Route>
            {/* 결제관리 */}
            <Route path="/expert/payment-management">
              <Route index element={<PaymentList />} />
            </Route>
            {/* 일정관리 - 3차 */}
            <Route path="/expert/schedule-management">
              <Route index element={<ScheduleList />} />
            </Route>
            {/* 고객문의 */}
            <Route path="/expert/message-center">
              <Route index element={<MessageCenter />} />
            </Route>
            {/* 리뷰문의 */}
            <Route path="/expert/review-center">
              <Route index element={<ReviewCenter />} />
              <Route path="reviewview" index element={<ReviewView />} />
            </Route>
            {/* 통계 */}
            <Route path="/expert/statistics">
              <Route index element={<Statistics />} />
              <Route path="monthuser" element={<UserStatisitcs />} />
            </Route>
          </Route>
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        {/* 관리자 */}
        <Route element={<AdminLayout />}>
          <Route path="/admin">
            <Route index element={<AdminMain />} />
            {/* 유저 관리 */}
            <Route path="userlist">
              <Route index element={<UserList />} />
              <Route path="onebyone" index element={<UserOneByOne />} />
              <Route path="userreport" index element={<UserReport />} />
            </Route>
            {/* 업체 조회 */}
            <Route path="businesssearch">
              <Route index element={<CategorySearch />} />
              <Route
                path="reservesearch"
                index
                element={<ReservationSearch />}
              />
              <Route path="ruesearch" index element={<RevenueSearch />} />
              <Route
                path="infomationbusi/:businessId"
                index
                element={<AdminBusinessInfo />}
              />
            </Route>
            {/* 업체,상품등록요청 */}
            <Route path="requestresi">
              <Route index element={<RequestBusi />} />
            </Route>
            <Route path="statistics">
              <Route index element={<AdMonth />} />
              <Route path="daysuser" index element={<AdDaysUser />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
