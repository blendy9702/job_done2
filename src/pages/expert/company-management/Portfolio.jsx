import { useEffect, useState } from "react";
import { ExpertListPageDiv } from "../reservation-management/reservationMangement";
import { TiPlus } from "react-icons/ti";
import {
  PortfolioListDiv,
  PortfolioListItemDiv,
  TitleAreaDiv,
} from "./companyManagement";
import AddPortfolio from "../../../components/portfolio/AddPortfolio";
import EditPortfolio from "../../../components/portfolio/EditPortfolio";
import { loginApi } from "../../../apis/login";
import PfPopup from "../../../components/serviceDetail/PfPopup";
import { useRecoilState, useRecoilValue } from "recoil";
import { PortfolioDetailInfoState } from "../../../atoms/portfolioAtom";
import { BASE_URL } from "../../../constants/constants";
import { Popup } from "../../../components/ui/Popup";
import { businessDetailState } from "../../../atoms/businessAtom";

function Portfolio() {
  const { categoryId, detailTypeId, businessId } =
    useRecoilValue(businessDetailState);
  const [portfolioDetailInfo, setPortfolioDetailInfoState] = useRecoilState(
    PortfolioDetailInfoState,
  );

  const [portfolioList, setPortfolioList] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

  // 포트폴리오 팝업
  const [isPopPfAdd, setIsPopPfAdd] = useState(false);
  const [isPopPfEdit, setIsPopPfEdit] = useState(false);
  const [isPfDetailPop, setIsPfDetailPop] = useState(false);
  // 확인 팝업
  const [isDeleteComplete, setIsDeleteComplete] = useState(false);
  const [isEditComplete, setIsEditComplete] = useState(false);

  // 포트폴리오 리스트 get
  const getPortfolioList = async (categoryId, detailTypeId, businessId) => {
    try {
      // /api/portfolio?categoryId=1&detailTypeId=2&businessId=2
      const res = await loginApi.get(
        `/api/portfolio?categoryId=${categoryId}&detailTypeId=${detailTypeId}&businessId=${businessId}`,
      );
      if (res.status === 200) {
        setPortfolioList(res.data.resultData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 포트폴리오 상세 정보 get
  const getDetailPortfolio = async portfolioId => {
    try {
      const res = await loginApi.get(`/api/portfolio/${portfolioId}`);
      if (res.status === 200) {
        setPortfolioDetailInfoState(res.data.resultData);
      }
    } catch (error) {
      console.error("포트폴리오 상세 정보 가져오기 실패:", error);
    }
  };

  const deletePortfolio = async (businessId, portfolioId) => {
    ///api/portfolio/%7BportfolioId%7D?businessId=2&portfolioId=44
    try {
      const res = await loginApi.delete("/api/portfolio/%7BportfolioId%7D", {
        params: {
          businessId: Number(businessId),
          portfolioId: Number(portfolioId),
        },
      });

      const updatedList = portfolioList.filter(
        portfolio => portfolio.portfolioId !== portfolioId,
      );

      // 상태 업데이트
      setPortfolioList(updatedList);
    } catch (error) {
      console.error("삭제 중 에러 발생:", error);
    }
  };

  const handleEditClick = async portfolioId => {
    setSelectedPortfolioId(portfolioId);
    setIsPopPfEdit(true);
    await getDetailPortfolio(portfolioId);
  };
  const handleGetPortfolioInfo = async portfolioId => {
    setSelectedPortfolioId(portfolioId);
    await getDetailPortfolio(portfolioId);
    setIsPfDetailPop(true);
  };

  useEffect(() => {
    getPortfolioList(categoryId, detailTypeId, businessId);
  }, [categoryId, detailTypeId, businessId]);

  return (
    <ExpertListPageDiv>
      <TitleAreaDiv>
        <h2 className="tit">포트폴리오</h2>
        <button
          onClick={() => {
            setIsPopPfAdd(true);
          }}
        >
          <p>포트폴리오</p> <TiPlus />
        </button>
      </TitleAreaDiv>
      <PortfolioListDiv>
        {/* 포트폴리오 리스트 아이템 */}
        {portfolioList.map(item => (
          <PortfolioListItemDiv
            key={item.portfolioId}
            onClick={() => {
              handleGetPortfolioInfo(item.portfolioId);
            }}
          >
            <div className="thum">
              <img src={`${BASE_URL}${item.thumbnail}`} alt={item.title} />
            </div>
            <div className="txt-area">
              <h4 className="tit">{item.title}</h4>
            </div>
          </PortfolioListItemDiv>
        ))}
      </PortfolioListDiv>
      {/* 포트폴리오 상세 팝업 */}
      <PfPopup
        isPfDetailPop={isPfDetailPop}
        setIsPfDetailPop={setIsPfDetailPop}
        portfolioId={selectedPortfolioId}
        isExpertMode={true}
        onEditClick={() => handleEditClick(selectedPortfolioId)}
        onDeleteClick={() => {
          const selectedPortfolio = portfolioList.find(
            item => item.portfolioId === selectedPortfolioId,
          );
          if (selectedPortfolio) {
            deletePortfolio(selectedPortfolio.businessId, selectedPortfolioId);
          }
        }}
        onDeleteComplete={() => setIsDeleteComplete(true)}
      />
      <Popup
        isOpen={isDeleteComplete}
        onClose={() => setIsDeleteComplete(false)}
        message="포트폴리오 삭제가 완료되었습니다"
        showConfirmButton={true}
      />
      {/* 포트폴리오 추가 팝업 */}
      {isPopPfAdd ? (
        <AddPortfolio
          setIsPopPfAdd={setIsPopPfAdd}
          deletePortfolio={deletePortfolio}
          getPortfolioList={getPortfolioList}
        />
      ) : (
        <></>
      )}
      {/* 포트폴리오 수정 팝업 */}
      {isPopPfEdit ? (
        <EditPortfolio
          setIsPopPfEdit={setIsPopPfEdit}
          portfolioId={selectedPortfolioId}
          getPortfolioList={getPortfolioList}
          setIsEditComplete={setIsEditComplete}
        />
      ) : (
        <></>
      )}
      <Popup
        title="알림"
        isOpen={isEditComplete}
        onClose={() => setIsEditComplete(false)}
        message="포트폴리오 수정이 완료되었습니다"
        showConfirmButton={true}
      />
    </ExpertListPageDiv>
  );
}

export default Portfolio;
