import styled from "@emotion/styled";
// 예약 페이지
export const ExpertListPageDiv = styled.div`
  padding: 30px 20px;
  position: relative;
  h2.tit {
    font-size: 28px;
    font-weight: 600;
    padding: 20px 0;
  }
  .pagination {
    /* position: absolute; */
    display: flex;
    /* bottom: 75px;
    left: 50%;
    transform: translateX(-50%); */
    justify-content: center;
    align-items: center;
    gap: 8px; /* 버튼 사이 간격 */
    margin: 35px 0 0;
  }
`;
// 예약 컨텐츠
export const EListContDiv = styled.div`
  padding: 25px 20px;
  background-color: #fff;
  min-height: calc(100% - 100px);
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;
// 예약리스트
export const ExportListDiv = styled.div`
  padding: 10px 0 0;
  /* border: 1px solid; */
  min-height: calc(100vh - 390px);
  border-bottom: 1px solid #eee;
  .tr {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 9px 10px;
    margin-bottom: 5px;
    border-top: 1px dotted #eee;
    border-bottom: 1px dotted #eee;

    /* 항목이름 */
    &:nth-of-type(1) {
      border: 1px solid #ececec;
      /* background-color: #f8f9fa; */
      background-color: rgb(233, 244, 255);
    }
    &:nth-of-type(2n) {
      background-color: #f8f9fa;
    }
  }
  /* 항목 가로길이 th, td 공통 */
  .th,
  .td {
    font-size: 14px;
    text-align: center;
    &:nth-of-type(1) {
      width: 15%;
    }
    &:nth-of-type(2) {
      width: 15%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 15%;
    }
    &:nth-of-type(5) {
      width: 15%;
    }
    &:nth-of-type(6) {
      width: 10%;
    }
    &:nth-of-type(7) {
      width: 15%;
    }
  }
  .th {
    /* color: #a0a3ab; */
    color: rgb(0, 37, 94);
  }

  .td {
    color: #6f6f6f;
    font-weight: 300;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      border: 1px solid rgb(226, 226, 226);
      font-size: 13px;
      padding: 4px 8px;
      /* max-width: 50px; */
      border-radius: 3px;
    }
    /* 유저 - 예약취소 */
    p.completed3 {
      background-color: #f8f9fa;
      color: #a0a3ab;
    }
    /* 예약완료 견적대기 */
    p.completed0 {
      background-color: #edfbf3;
      color: #41b662;
    }
    /* 예약승락 - 견적서 작성중 */
    p.completed1 {
      background-color: #e8f2ff;
      color: #4b8ff8;
    }
    /* 업체 - 예약 거절*/
    p.completed5 {
      background-color: #fdeeec;
      color: #db3319;
    }
    p.all {
      background-color: #fff;
      color: #333;
    }

    p.completed-0 {
      background-color: #edfbf3;
      color: #41b662;
    }
    p.completed-1 {
      background-color: #f8f9fa;
      color: #a0a3ab;
      min-width: 63px;
    }
    p.completed-2 {
      background-color: #e8f2ff;
      color: #4b8ff8;
    }
    /* 신청서 */
    button {
      font-weight: 600;
    }
  }
  .blue {
    color: #2859ff;
  }
  .green {
    color: #00a500;
  }
  .black {
    color: #333;
    font-weight: 400;
  }
  .red {
    color: red;
    font-weight: 500;
    font-size: 12px;
  }
  .btn-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
  }
`;
// 결제리스트
export const ExportPaymentListDiv = styled(ExportListDiv)`
  /* 항목 가로길이 th, td 공통 */
  .th,
  .td {
    font-size: 14px;
    text-align: center;
    &:nth-of-type(1) {
      width: 15%;
    }
    &:nth-of-type(2) {
      width: 30%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 12%;
    }
    &:nth-of-type(5) {
      width: 12%;
    }
    &:nth-of-type(6) {
      width: 16%;
    }
  }
`;
