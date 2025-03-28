import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";
import DOMPurify from "dompurify";
import { useRecoilState } from "recoil";
import { loginApi } from "../../../apis/login";
import {
  reviewIdState,
  reviewPicsList,
  selectReviewAtom,
} from "../../../atoms/reviewAtom";
////////////////////////////////////////////////////////////////////////////////////////////
const ReviewView = ({ handleCloseModal }) => {
  const BASE_URL = "https://job-done.r-e.kr:52340";
  const [form] = Form.useForm();
  const [selectReview] = useRecoilState(selectReviewAtom);
  const [reviewPicsData] = useRecoilState(reviewPicsList);
  const [, setReviewComment] = useState(true);
  const [reviewIds] = useRecoilState(reviewIdState);
  const [isComments, setIsComments] = useState(selectReview.replyStatus !== "");
  const [forceRender, setForceRender] = useState(0);

  const [busiReview, setBusiReview] = useState(
    selectReview.replyStatus === null ? "" : selectReview.replyStatus.contents,
  );

  const picData = reviewPicsData.pics.filter(
    (_, index) => (index + 1) % 2 !== 0,
  );

  const initData = {
    reviewId: reviewIds,
    contents: busiReview ? busiReview : "",
  };
  const renderStars = score => {
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: fullStars }, (_, i) => (
          <FaStar key={`full-${i}`} color="#EAB838" />
        ))}
        {halfStar && <FaStarHalf key="half" color="#EAB838" />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <FaStar key={`empty-${i}`} color="#E0E2E7" />
        ))}
      </div>
    );
  };

  const deleteComment = async () => {
    try {
      await loginApi.delete(`/api/review/comment?reviewId=${reviewIds}`);
      setBusiReview("");
      handleCloseModal();
      // setIsComments(false);
      // navigate("/expert/review-center");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async data => {
    try {
      await loginApi.post("/api/review/comment", {
        reviewId: reviewIds,
        contents: data.contents,
      });

      // 상태 업데이트 (즉시 반영)
      setBusiReview(data.contents);
      setIsComments(true);
      setReviewComment(false);

      // 강제 리렌더링 트리거
      setForceRender(prev => prev + 1);

      // Form 필드 초기화
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };
  const onEdit = async data => {
    try {
      await loginApi.put(`/api/review/comment?reviewId=${reviewIds}`, {
        reviewId: reviewIds,
        contents: data,
      });

      setBusiReview(data);
      setIsComments(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    form.setFieldsValue({ contents: busiReview });
  }, [busiReview, form]);

  return (
    <div
      style={{
        padding: "40px",
        background: "#f9f9f9",
        borderRadius: "10px",
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 1px 3px, rgba(0, 0, 0, 0.06) 0px 1px 2px",
        maxWidth: "800px",
        margin: "20px auto",
      }}
    >
      {/* 유저 정보 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          marginBottom: "15px",
        }}
      >
        <div>{selectReview.userName}님의 리뷰</div>
        <div>등록 날짜: {selectReview.createdAt}</div>
        {renderStars(selectReview.score)}
      </div>

      {/* 리뷰 카드 */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px",
          marginBottom: "20px",
        }}
      >
        <p style={{ color: "#333", lineHeight: "1.5" }}>
          {selectReview.contents}
        </p>
      </div>

      {/* 리뷰 사진 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {picData.map((item, index) => (
          <img
            key={index}
            src={`${BASE_URL}${item}`}
            alt="리뷰사진"
            style={{ height: "150px", borderRadius: "5px", objectFit: "cover" }}
          />
        ))}
      </div>

      {/* 답글 섹션 */}
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>업체 답글</h2>
      {isComments ? (
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            marginBottom: "15px",
            whiteSpace: "pre-line",
          }}
        >
          <p> {DOMPurify.sanitize(busiReview)}</p>
        </div>
      ) : (
        <Form
          form={form}
          initialValues={initData}
          onFinish={onSubmit}
          style={{
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form.Item name="contents">
            <Input.TextArea
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "16px",
                whiteSpace: "pre-line",
              }}
            />
          </Form.Item>
          <div
            style={{ display: "flex", width: "100%", justifyContent: "right" }}
          >
            {selectReview.replyStatus === null ? (
              <Button
                htmlType="submit"
                style={{
                  backgroundColor: "#0049a5",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  marginRight: "0",
                  width: "100px",
                }}
              >
                등록
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const contentsValue = form.getFieldValue("contents");
                  onEdit(contentsValue);
                }}
                style={{
                  backgroundColor: "#0049a5",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "5px",

                  width: "100px",
                }}
              >
                수정
              </Button>
            )}
          </div>
        </Form>
      )}

      {/* 수정 & 삭제 버튼 */}
      {isComments && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          {(selectReview.replyStatus !== null) | (busiReview !== "") ? (
            <button
              onClick={deleteComment}
              style={{
                padding: "8px 16px",
                background: "#ff3044",
                color: "white",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
              type="button"
            >
              삭제
            </button>
          ) : (
            <div></div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            {selectReview.replyStatus === null ? (
              <button
                onClick={() => {
                  setReviewComment(false);
                  setIsComments(false);
                }}
                style={{
                  backgroundColor: "#0049a5",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  marginRight: "0",
                  width: "80px",
                }}
              >
                등록
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setReviewComment(false);
                  setIsComments(false);
                }}
                style={{
                  backgroundColor: "#0049a5",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  width: "80px",
                }}
              >
                수정
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewView;
