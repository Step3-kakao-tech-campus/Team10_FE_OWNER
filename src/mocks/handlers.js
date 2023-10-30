import { rest } from "msw";
import { home } from "./responses/home";
import { carwashes } from "./responses/carwashes";
import { carwashesDetails } from "./responses/carwashesDetails";
import { revenue } from "./responses/revenue";
import { sales } from "./responses/sales";

export const handlers = [
  // 회원가입
  rest.post("/join/owner", (req, res, ctx) => {
    const { username, email, password, tel } = req.body;

    const regex = {
      email: /^\w[\w._%+-]+@\w[\w.-]+\.[a-zA-Z]{2,6}$/,
      password:
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!~`<>,./?;:'"\[\]{}\\()|_-])\S*$/,
    };

    function validate(field, isValid, message) {
      if (!isValid) {
        return res(
          ctx.status(401),
          ctx.json({
            success: false,
            response: null,
            error: { message: message, status: 401 },
          })
        );
      }
    }

    const validators = [
      {
        field: "username",
        isValid: username && username.length >= 8 && username.length <= 45,
        message: "사용자 이름은 8-45자 사이여야 합니다.",
      },
      {
        field: "email",
        isValid: email && regex.email.test(email),
        message: "이메일 형식으로 작성해주세요.",
      },
      {
        field: "password",
        isValid:
          password &&
          regex.password.test(password) &&
          password.length >= 8 &&
          password.length <= 45,
        message: "비밀번호 형식이 올바르지 않습니다.",
      },
      {
        field: "tel",
        isValid: tel && tel.length >= 9 && tel.length <= 14,
        message: "전화번호 형식이 올바르지 않습니다.",
      },
    ];

    for (const { field, isValid, message } of validators) {
      const response = validate(field, isValid, message);
      if (response) return response;
    }

    return res(ctx.json({ success: true, response: null, error: null }));
  }),

  // 로그인
  rest.post("/login/owner", (req, res, ctx) => {
    const { email, password } = req.body;

    if (email !== "owner@nate.com" || password !== "owner1234!") {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          response: null,
          error: "인증에 실패했습니다.",
        })
      );
    }

    const token =
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzc2FyQG5hdGUuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImlkIjoxLCJleHAiOjE2ODcwNTM5MzV9.fXlD0NZQXYYfPHV8rokRJTM86nhS869LZ1KIGi7_qvPOcVbXgvyZLKvnlLxomIiS3YFnQRLzXAJ2G41yI_AmG1";
    localStorage.setItem("token", token);

    return res(
      ctx.set("Authorization", token),
      ctx.status(200),
      ctx.json({
        success: true,
        response: null,
        error: null,
      })
    );
  }),
  // 매장 정보 수정(기존 정보 가져오기)
  rest.get("/owner/carwashes/:carwash_id/details", (req, res, ctx) => {
    const carwash_id = req.params;
    // carwash_id로 특정 세차장 가져오는 코드 추가하기
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        response: {
          id: carwash_id,
          image: [
            "https://github.com/Step3-kakao-tech-campus/Team10_FE_OWNER/assets/104883910/b214edfd-a3b7-4eb0-aaef-9dd4705ca24e",
            "https://github.com/Step3-kakao-tech-campus/Team10_FE_OWNER/assets/104883910/16b2ae1e-d904-48fc-b1e2-660b38c25c3f",
            "https://github.com/Step3-kakao-tech-campus/Team10_FE_OWNER/assets/104883910/fdb8f53b-08eb-4b35-8b89-0394473c2d7b",
          ],
          name: "포세이돈워시 용봉점",
          price: "5000",
          tel: "062-000-0000",
          location: {
            placeName: "포세이돈워시 용봉점",
            address: "광주 북구 용봉동 230",
          },
          bayCnt: "4",
          optime: {
            weekday: {
              start: "09:00:00",
              end: "17:00:00",
            },
            weekend: {
              start: "10:00:00",
              end: "16:00:00",
            },
            keypointId: [1, 3],
            des: "포세이돈워시에 오신 것을 환영합니다.",
          },
          error: null,
        },
      })
    );
  }),

  // 매장 정보 수정
  // 백엔드 단에서 Validation 필요함
  rest.put("/owner/carwashes/:carwash_id/details", (req, res, ctx) => {
    const carwash_id = req.params;
    const token = req.headers.get("Authorization");
    const modifiedInfo = req.body;

    console.log("수정된 세차장 정보: ", modifiedInfo);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ success: true, response: null, error: null })
    );
  }),

  // 입점신청
  // 사진 업로드는 multipart/form-data
  rest.post("/owner/carwashes/register", (req, res, ctx) => {
    const token = req.headers.get("Authorization");
    const formData = req.body;

    console.log("입점신청 정보: ", formData);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ success: true, response: null, error: null })
    );
  }),

  // 베이 추가
  rest.post("/owner/carwashes/:carwash_id/bays", (req, res, ctx) => {
    const carwash_id = req.params;
    const token = req.headers.get("Authorization");

    const bayInfo = req.body;

    console.log("추가한 베이 정보: ", bayInfo);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ success: true, response: null, error: null })
    );
  }),

  // 베이 활성화/비활성화
  rest.put("/owner/bays/:bay_id/status", (req, res, ctx) => {
    const { bay_id, status } = req.params;
    const token = req.headers.get("Authorization");

    console.log("변경된 베이 상태: ", status);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ success: true, response: null, error: null })
    );
  }),

  // 매장 관리 - owner 별
  rest.get("/owner/carwashes", (req, res, ctx) => {
    const token = req.headers.get("Authorization");

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(ctx.status(200), ctx.json(carwashes));
  }),

  // 매출관리 페이지
  rest.get("/owner/sales", (req, res, ctx) => {
    const selected_date = req.url.searchParams.get("selected-date");
    const carwash_id = req.url.searchParams.get("carwash-id");

    const token = req.headers.get("Authorization");

    console.log("selected_date: ", selected_date);
    console.log("carwash_id: ", carwash_id);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(ctx.status(200), ctx.json({ sales }));
  }),

  // 매장 관리 - 세차장 별
  rest.get("/owner/carwashes/:carwash_id", (req, res, ctx) => {
    const carwash_id = req.params.carwash_id;
    const token = req.headers.get("Authorization");

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(ctx.status(200), ctx.json(carwashesDetails));
  }),

  // 총 매출 금액 조회
  rest.get("/owner/revenue", (req, res, ctx) => {
    const selected_date = req.url.searchParams.get("selected-date");
    const carwash_id = req.url.searchParams.get("carwash-id");

    const token = req.headers.get("Authorization");

    console.log("selected_date: ", selected_date);
    console.log("carwash_id: ", carwash_id);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(ctx.status(200), ctx.json({ revenue }));
  }),

  // 사장님 홈
  rest.get("/owner/home", (req, res, ctx) => {
    const token = req.headers.get("Authorization");

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(ctx.status(200), ctx.json(home));
  }),

  // 예약 취소
  rest.delete("/reservations/:reservation_id", (req, res, ctx) => {
    const reservation_id = req.params.reservation_id;
    const token = req.headers.get("Authorization");

    console.log("취소할 예약 번호: ", reservation_id);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({ error: "인증되지 않았습니다. (토큰 없음)" })
      );
    }

    return res(ctx.status(200));
  }),

  rest.post("/user/check", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        response: null,
        error: null,
      })
    );
  }),
];
