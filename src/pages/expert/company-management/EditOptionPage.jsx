import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  ExpertOptionInfoDiv,
  ExportPageDiv,
  OpContBoxDiv,
  TitleAreaDiv,
} from "./companyManagement";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { businessDetailState } from "../../../atoms/businessAtom";
import { loginApi } from "../../../apis/login";
import { ProductState } from "../../../atoms/productAtom";
import { useNavigate } from "react-router-dom";
import { Popup } from "../../../components/ui/Popup";
const priceSchema = yup.object({
  productPrice: yup.number(),
});

function EditOptionPage() {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [detailOptions, setDetailOptions] = useState({});
  const productbasicPrice = useRecoilValue(businessDetailState);
  const ProductInfo = useRecoilValue(ProductState);
  const [productPrice, setProductPrice] = useState(
    productbasicPrice?.price || 0, // 기본값으로 0 설정
  );
  const setProductInfo = useSetRecoilState(ProductState);
  const [popupState, setPopupState] = useState({
    isOpen: false,
    message: "",
  });
  //   console.log(productbasicPrice.price);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(priceSchema),
    defaultValues: {
      productPrice: productPrice,
    },
    mode: "onBlur",
  });

  const handleSubmitForm = async data => {
    // productId 필수값 확인
    if (!ProductInfo.productId) {
      console.error("productId가 없습니다.");
      return;
    }

    // options 데이터 변환
    const transformedOptions = ProductInfo.optionList.map(option => ({
      optionId: option.optionId || 0, // 옵션 ID 포함
      optionName: option.optionName,
      optionDetails: option.optionDetailList.map(detail => ({
        optionDetailId: detail.optionDetailId || 0, // 상세 옵션 ID 포함
        optionDetailName: detail.optionDetailName,
        optionDetailPrice: detail.optionDetailPrice,
      })),
    }));

    const requestData = {
      price: Number(data.productPrice),
      productId: ProductInfo.productId,
      options: transformedOptions,
      productName: ProductInfo.productName,
      productDescription: ProductInfo.productDescription,
      categoryId: ProductInfo.categoryId,
      businessId: ProductInfo.businessId,
    };

    try {
      const res = await loginApi.post("/api/product/postAll", requestData);
      console.log("API 응답:", res.data);
      setProductInfo(prev => ({
        ...prev,
        productPrice: data.productPrice,
      }));

      // 팝업 표시
      setPopupState({
        isOpen: true,
      });
    } catch (error) {
      console.error("API 오류:", error);
    }
  };

  const handleAddOption = () => {
    if (!newOptionName.trim()) {
      console.error("옵션명을 입력해주세요.");
      return;
    }

    const newOption = {
      optionId: 0, // 새로운 옵션일 경우 0
      optionName: newOptionName,
      optionDetailList: [], // 빈 배열로 초기화
    };

    setProductInfo(prev => ({
      ...prev,
      optionList: [...prev.optionList, newOption],
    }));
    setNewOptionName(""); // 입력 필드 초기화
  };
  // 옵션명
  const handleAddDetailOption = optionIndex => {
    const currentDetailOption = detailOptions[optionIndex] || {
      name: "",
      price: "",
    };

    if (!currentDetailOption.name.trim() || !currentDetailOption.price) {
      console.error("선택옵션명과 금액을 입력해주세요.");
      return;
    }

    const newDetailOption = {
      optionDetailId: 0, // 새로운 상세 옵션일 경우 0
      optionDetailName: currentDetailOption.name,
      optionDetailPrice: Number(currentDetailOption.price),
    };

    setProductInfo(prev => {
      const updatedOptionList = prev.optionList.map((option, index) => {
        if (index === optionIndex) {
          return {
            ...option,
            optionDetailList: [...option.optionDetailList, newDetailOption],
          };
        }
        return option;
      });
      return {
        ...prev,
        optionList: updatedOptionList,
      };
    });

    // 입력 필드 초기화
    setDetailOptions({
      ...detailOptions,
      [optionIndex]: { name: "", price: "" },
    });
  };
  // 옵션명
  const handleDeleteOption = async optionIndex => {
    const optionId = ProductInfo.optionList[optionIndex].optionId; // 옵션 ID 가져오기

    // 새로운 옵션일 경우 (optionId가 0) UI에서만 제거
    if (optionId === 0) {
      setProductInfo(prev => ({
        ...prev,
        optionList: prev.optionList.filter((_, idx) => idx !== optionIndex),
      }));
      return;
    }

    // businessId가 없으면 오류 처리
    const businessId = localStorage.getItem("businessId");
    if (!businessId) {
      console.error("businessId가 없습니다.");
      return;
    }

    try {
      const res = await loginApi.delete("/api/product/option", {
        data: {
          businessId: Number(businessId),
          optionId: optionId,
        },
      });
      console.log("옵션 삭제 성공:", res.data);

      // 삭제된 옵션을 UI에서 제거
      setProductInfo(prev => ({
        ...prev,
        optionList: prev.optionList.filter((_, idx) => idx !== optionIndex),
      }));
    } catch (error) {
      console.error("옵션 삭제 실패:", error);
    }
  };

  // 선택옵션
  const handleDetailOptionChange = (optionIndex, field, value) => {
    setDetailOptions({
      ...detailOptions,
      [optionIndex]: {
        ...(detailOptions[optionIndex] || { name: "", price: "" }),
        [field]: value,
      },
    });
  };
  // 선택옵션
  const handleDeleteDetailOption = async (optionIndex, detailIndex) => {
    const optionDetailId =
      ProductInfo.optionList[optionIndex].optionDetailList[detailIndex]
        .optionDetailId; // 상세 옵션 ID

    // 상세 옵션 아이디가 0이면 (새로운 옵션) UI에서만 제거
    if (optionDetailId === 0) {
      setProductInfo(prev => {
        const updatedOptionList = prev.optionList.map((option, idx) => {
          if (idx === optionIndex) {
            return {
              ...option,
              optionDetailList: option.optionDetailList.filter(
                (_, idx) => idx !== detailIndex,
              ),
            };
          }
          return option;
        });
        return {
          ...prev,
          optionList: updatedOptionList,
        };
      });
      return; // 서버 요청 없이 함수 종료
    }

    // businessId가 없으면 오류 처리
    const businessId = localStorage.getItem("businessId");
    if (!businessId) {
      console.error("businessId가 없습니다.");
      return;
    }

    try {
      const res = await loginApi.delete("/api/product/option/detail", {
        data: {
          businessId: Number(businessId), // 숫자로 변환
          optionDetailId: optionDetailId,
        },
      });
      console.log("상세 옵션 삭제 성공:", res.data);

      // 삭제된 상세 옵션을 UI에서 제거
      setProductInfo(prev => {
        const updatedOptionList = prev.optionList.map((option, idx) => {
          if (idx === optionIndex) {
            return {
              ...option,
              optionDetailList: option.optionDetailList.filter(
                (_, idx) => idx !== detailIndex,
              ),
            };
          }
          return option;
        });
        return {
          ...prev,
          optionList: updatedOptionList,
        };
      });
    } catch (error) {
      console.error("상세 옵션 삭제 실패:", error);
    }
  };

  const handleKeyPress = (e, type, optionIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (type === "option") {
        handleAddOption();
      } else if (type === "detail") {
        handleAddDetailOption(optionIndex);
      }
    }
  };

  const handleProductPriceChange = e => {
    // console.log("가격변화!:", e.target.value);
    const value = e.target.value.replace(/,/g, "");
    setProductPrice(value);
  };

  const handleProductPriceComplete = () => {
    // console.log("Product Price:", productPrice);
    if (productPrice.trim()) {
      setProductPrice(productPrice);
      handleSubmitForm({ productPrice: Number(productPrice) });
    }
  };
  useEffect(() => {
    if (productbasicPrice?.price) {
      setProductPrice(productbasicPrice.price);
    }
  }, [productbasicPrice]);

  // ProductState의 옵션 데이터를 컴포넌트의 options 상태로 변환하여 로드
  useEffect(() => {
    if (ProductInfo.optionList) {
      const transformedOptions = ProductInfo.optionList.map(option => ({
        name: option.optionName,
        details: option.optionDetailList.map(detail => ({
          name: detail.optionDetailName,
          price: detail.optionDetailPrice,
        })),
      }));
      setOptions(transformedOptions);
    }
  }, [ProductInfo]);

  useEffect(() => {
    console.log("ProductInfo 업데이트:", ProductInfo);
  }, [ProductInfo]);

  return (
    <ExportPageDiv>
      <ExpertOptionInfoDiv>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <TitleAreaDiv>
            <h2 className="tit">상품 옵션 수정</h2>
            <button type="submit">
              <p>상품옵션 저장</p> <MdModeEdit />
            </button>
          </TitleAreaDiv>
          <OpContBoxDiv>
            {/* 옵션정보 */}

            <div className="option-info">
              <h4 className="tit">상품기본 정보</h4>
              <label>
                <b>카테고리 </b>
                <span>
                  <p>음식점청소</p>
                </span>
              </label>
              <label>
                <b>기본금액 </b>
                <input
                  className="basic-price"
                  type="text"
                  {...register("productPrice")}
                  value={Number(productPrice).toLocaleString()}
                  onChange={handleProductPriceChange}
                  onBlur={handleProductPriceComplete}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleProductPriceComplete();
                    }
                  }}
                />
              </label>
            </div>
            {/* 옵션 등록 */}
            <div className="op-box">
              <h4 className="tit">상품옵션 정보</h4>
              <label className="add-option">
                <input
                  type="text"
                  placeholder="옵션명"
                  value={newOptionName}
                  onChange={e => setNewOptionName(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, "option")}
                />
                <button type="button" onClick={handleAddOption}>
                  옵션 추가
                </button>
              </label>
              <div className="option-list">
                {ProductInfo.optionList?.map((option, optionIndex) => (
                  <div className="option-box" key={optionIndex}>
                    <h3>
                      <span>
                        옵션 {optionIndex + 1} : {option.optionName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(optionIndex)}
                      >
                        삭제
                      </button>
                    </h3>
                    <ul className="op-detail-list">
                      {option.optionDetailList.map((detail, detailIndex) => (
                        <li className="op-item" key={detailIndex}>
                          <p>
                            <span>{detail.optionDetailName}</span>
                            <em>
                              {detail.optionDetailPrice.toLocaleString()} 원
                            </em>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteDetailOption(
                                  optionIndex,
                                  detailIndex,
                                )
                              }
                            >
                              삭제
                            </button>
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="add-detail-op">
                      <input
                        type="text"
                        placeholder="선택옵션"
                        value={
                          (detailOptions[optionIndex] || { name: "" }).name
                        }
                        onChange={e =>
                          handleDetailOptionChange(
                            optionIndex,
                            "name",
                            e.target.value,
                          )
                        }
                        onKeyDown={e =>
                          handleKeyPress(e, "detail", optionIndex)
                        }
                      />
                      <input
                        type="number"
                        placeholder="금액"
                        value={
                          (detailOptions[optionIndex] || { price: "" }).price
                        }
                        onChange={e =>
                          handleDetailOptionChange(
                            optionIndex,
                            "price",
                            e.target.value,
                          )
                        }
                        onKeyDown={e =>
                          handleKeyPress(e, "detail", optionIndex)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleAddDetailOption(optionIndex)}
                      >
                        선택 옵션 추가
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </OpContBoxDiv>
        </form>
      </ExpertOptionInfoDiv>
      <Popup
        isOpen={popupState.isOpen}
        message={"상품옵션 수정이 완료되었습니다."}
        showConfirmButton={true}
        onConfirm={() => {
          navigate("/expert/company-management");
        }}
      />
    </ExportPageDiv>
  );
}

export default EditOptionPage;
