import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Photo from "./Photo";
import Logo from "/logo.svg";
import Button from "./Button";

const GNB = () => {
  const [currentPage, setCurrentPage] = useState("/");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(location.pathname);
    console.log(currentPage);
  }, [location]);

  const menus = [
    {
      label: "매출관리",
      path: "/sales",
    },
    {
      label: "매장관리",
      path: "/manage",
    },
  ];

  return (
    <nav className="border-b border-gray-300">
      <div className="w-[1280px] mx-auto flex justify-between items-center px-4">
        <section className="flex gap-12 items-center">
          <Link to="/">
            <Photo src={Logo} alt="뽀득뽀득 사장님 페이지 로고" />
          </Link>

          <ul className="flex">
            {menus.map((menu, index) => {
              return (
                <Link key={index} to={menu.path}>
                  <li
                    className={`${
                      currentPage === menu.path
                        ? "border-b-8 border-primary text-primary"
                        : ""
                    } text-xl p-8`}>
                    {menu.label}
                  </li>
                </Link>
              );
            })}
          </ul>
        </section>

        <section className="flex gap-6">
          <div className="text-right">
            <div className="text-xl">김춘식 사장님</div>
            <Button className="text-gray-500">로그아웃</Button>
          </div>
          <Button
            style="cta"
            onClick={() => {
              navigate("/register");
            }}>
            입점하기
          </Button>
        </section>
      </div>
    </nav>
  );
};

export default GNB;
