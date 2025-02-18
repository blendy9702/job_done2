import React, { useEffect, useState } from "react";
import {
  AddOptionDiv,
  DatePriceDiv,
  QuotationDiv,
  QuotationFormDiv,
} from "./qouteManagement";
import { BtnAreaDiv } from "../../../components/papers/papers";
import { loginApi } from "../../../apis/login";

function QuotationForm() {
  const [papersInfo, setPapersInfo] = useState();
  const getBusinessId = localStorage.getItem("businessId");

  const getPapersInfo = async () => {
    try {
      const res = await loginApi.get("/api/service/detail", {
        params: {
          serviceId: 0,
          businessId: getBusinessId,
        },
      });
      console.log(res.data);
      if (res.status === 200) {
        setPapersInfo(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPapersInfo();
  }, []);

  return (
    <QuotationDiv>
      <h2 className="tit">견적서 작성</h2>
      <QuotationFormDiv>
        <form>
          <div>
            <h3>공급자</h3>
            <div>
              <label>
                <h4>사업자번호</h4>
                <span>{papersInfo.businessNum}</span>
              </label>
              <label>
                <h4>연락처</h4>
                <input type="text" />
              </label>
              <label>
                <h4>상호명</h4>
                <input type="text" />
              </label>
              <label>
                <h4>분류</h4>
                <input type="text" />
              </label>
              <label>
                <h4>주소</h4>
                <input type="text" />
              </label>
            </div>
          </div>
          {/* 고객정보 */}
          <div>
            <h3>고객정보</h3>
            <div>
              <label>
                <h4>예약자명</h4>
                <input type="text" />
              </label>
              <label>
                <h4>연락처</h4>
                <input type="text" />
              </label>
              <label>
                <h4>주소</h4>
                <input type="text" />
              </label>
            </div>
          </div>
          {/* 예약내용 */}
          <div>
            <h3>예약내용</h3>
            <div>
              <label>
                <h4>예약일자</h4>
                <input type="text" />
              </label>
              <label>
                <h4>평수</h4>
                <input type="text" />
              </label>
              <label>
                <h4>옵션</h4>
                <input type="text" />
              </label>
            </div>
          </div>
          {/* 문의사항 */}
          <div className="text-area">
            <h3>문의사항</h3>
            <textarea />
          </div>
          {/* 견적내용 추가 */}
          <AddOptionDiv>
            <h3>추가견적</h3>
            <div>
              <div className="tr head">
                <div className="th">No.</div>
                <div className="th">내용</div>
                <div className="th">금액</div>
                <div className="th">비고</div>
              </div>
              <div className="tr">
                <div className="td">1</div>
                <div className="td">
                  <input type="text" />
                </div>
                <div className="td price">
                  <input type="text" />
                </div>
                <div className="td">
                  <input type="text" />
                </div>
              </div>
              <div className="tr">
                <div className="td">2</div>
                <div className="td">
                  <input type="text" />
                </div>
                <div className="td price">
                  <input type="text" />
                </div>
                <div className="td">
                  <input type="text" />
                </div>
              </div>
              <div className="tr">
                <div className="td">3</div>
                <div className="td">
                  <input type="text" />
                </div>
                <div className="td price">
                  <input type="text" />
                </div>
                <div className="td">
                  <input type="text" />
                </div>
              </div>
            </div>
          </AddOptionDiv>
          {/* 견적일자 */}
          <DatePriceDiv>
            <h3>견적일자 및 총금액</h3>
            <div className="date">
              {/* 견적일 */}
              <div>
                <h4>견적일</h4>
                <div>
                  <input type="date" name="" id="" /> -
                  <input type="date" name="" id="" />
                </div>
              </div>
              {/* 견적시간 */}
              <div>
                <h4>견적시간</h4>
                <div>
                  <input type="time" name="" id="" /> -
                  <input type="time" name="" id="" />
                </div>
              </div>
            </div>
            {/* 견적금액 */}
            <div className="price">
              <h4>견적금액</h4>
              <div>
                <input type="text" name="" id="" />
              </div>
            </div>
          </DatePriceDiv>
          {/* 특이사항 */}
          <div className="text-area">
            <h3>특이사항</h3>
            <textarea />
          </div>
          <BtnAreaDiv>
            <button type="button" className="cancel">
              취소
            </button>
            <button type="button" className="okay">
              작성완료
            </button>
          </BtnAreaDiv>
        </form>
      </QuotationFormDiv>
    </QuotationDiv>
  );
}

export default QuotationForm;
