import { useState } from "react";
import "./adminsidebar.css";
import { GoChevronDown } from "react-icons/go";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = { display: "flex", justifyContent: "!end", width: "100%" };

  const [requestMenu, setRequestMenu] = useState<boolean>(false);
  const [searchMenu, setSearchMenu] = useState<boolean>(false);
  const reqOpen = () => {
    setRequestMenu(!requestMenu);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>관리자 패널</h2>
      </div>
      <nav>
        <Link to="/admin">메인</Link>
        <button
          onClick={() => reqOpen()}
          style={{ display: "flex", justifyContent: "!end", width: "100%" }}
        >
          업체 • 상품 등록 요청
          <GoChevronDown />
        </button>
        {requestMenu ? (
          <div>
            <Link to="/admin/requestresi" style={linkStyle}>
              {" "}
              • 업체 등록 요청
            </Link>
            <Link to="/admin/requestresi/requestproduct" style={linkStyle}>
              {" "}
              • 상품 등록 요청
            </Link>
          </div>
        ) : (
          ""
        )}
        <button
          onClick={() => setSearchMenu(!searchMenu)}
          style={{ display: "flex", justifyContent: "!end", width: "100%" }}
        >
          업체 조회
          <GoChevronDown />
        </button>
        {searchMenu ? (
          <div>
            <Link to="/admin/businesssearch" style={linkStyle}>
              카테고리 조회
            </Link>
            <Link to="/admin/reservationsearch" style={linkStyle}>
              예약 별 조회
            </Link>
            <Link to="/admin/revenuesearch" style={linkStyle}>
              매출 별 조회
            </Link>
          </div>
        ) : (
          ""
        )}

        <Link to="/admin/userlist">유저</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
