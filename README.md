# 🌳 Project: Tree


<img src="https://github.com/user-attachments/assets/284eba39-ccc8-4264-bffe-0a8ee0dc96ba" width="300"/>


## About the Project

**프로젝트 제목**: Tree — 감정 기반 자기 성찰 다이어리 & 리포트 서비스  
**진행 기간**: 2025년 4월 ~ 2025년 6월  
**프로젝트 목적**: 사용자 일기를 바탕으로 월간 감정 리포트를 제공하여 자기 인식과 심리 건강 증진을 돕는 프론트엔드 중심의 서비스입니다.  

> 🌱 매일 쓰는 일기에서 나만의 성장 히스토리를 발견해보세요.


## Frontend developer Introduction



<table>
<tr>
  <td align="center">
    <a href="https://github.com/sungwonnoh">
      <img src="https://github.com/sungwonnoh.png" width="200px;" alt="sungwonnoh"/><br />
      <sub><b>노성원</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Debuging-JunSeoPark">
      <img src="https://github.com/Debuging-JunSeoPark.png" width="200px;" alt="Debuging-JunSeoPark"/><br />
      <sub><b>박준서</b></sub>
    </a>
  </td>
</tr>
</table>



---

## 🚀 Getting Started
## 🛠 Tech Stack

- **Frontend**: React + TypeScript
- **UI Framework**: TailwindCSS
- **Charting**: Recharts, Wordcloud.js
- **Routing**: React Router DOM
- **State Management**: React Hooks, Context
- **Deployment**: Vercel

---

### Requirements
- Node.js >= 23.11.0
- npm >= 10.9.2
- Vite >= 6.3.4

### 📦 Installation
```bash
# 1. Clone the repository
git clone https://github.com/25SolutionChallenge-tree/FE_tree.git
cd FE_tree

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

```
### 📦 Installed Packages

| Package       | Purpose                               |
| ------------- | ------------------------------------- |
| `swiper`      | Week chart swipe interaction (슬라이드)   |
| `recharts`    | Weekly area chart (감정 흐름 시각화)         |
| `tailwindcss` | Utility-first CSS framework (UI 스타일링) |
| `date-fns`    | 날짜 포맷 및 조작 유틸리티                       |
| `wordcloud`   | 감정 키워드 워드클라우드 생성 (`<canvas>`)         |


---

## 🖼️ Screenshots

| 홈 | 감정 일기 작성 | 월간 기록 | 주간 기록 및 워드 클라우드 |
|:--:|:--:|:--:|:--:|
| <img src="https://github.com/user-attachments/assets/f2386b35-9701-45e5-8a7c-0e3c4e037b29" width="180"/> | <img src="https://github.com/user-attachments/assets/6072d779-8601-431e-8cfd-723db3795ab4" width="180"/> | <img src="https://github.com/user-attachments/assets/a4fcae89-b8a2-42b0-a0ba-9cc5cf9aedce" width="180"/> | <img src="https://github.com/user-attachments/assets/baa44948-e786-478e-8cb2-c7421a27cb8a" width="180"/> |

| 월간 리포트 상세 내용 | 
|:--:|
| <img src="https://github.com/user-attachments/assets/d5263244-f05c-4186-b8e7-11d60b563261" width="180"/> |  |  |  |


---

## 🌟 Features

- [x] 질문 기반 아침/점심/저녁 일기 작성 기능
- [x] 주간/월간 레포트 시각화 제공
- [x] 감정 키워드 워드클라우드 분석
- [x] 월간 감정 변화 요약 및 리스크 분석
- [x] 성격 유형 기반 추천 링크 제공

---

## 🧩 Project Structure

```
tree
├── apis/                         # API 통신 및 타입 정의
│   ├── auth.ts
│   ├── auth.type.ts
│   ├── diary.ts
│   ├── diary.type.ts
│   ├── instance.ts
│   ├── user.ts
│   └── user.type.ts
├── assets/                       # 이미지 및 정적 리소스
│   ├── images/                   # 프로젝트 이미지 (아이콘, 로고, 트리 등)
│   └── react.svg
├── components/                   # 재사용 가능한 UI 컴포넌트
│   ├── ReportModal.tsx
│   ├── ReportMonthly.tsx
│   ├── ReportWeekly.tsx
│   ├── WordCloud.tsx
│   └── ... (기타 UI 컴포넌트)
├── layout/                       # 레이아웃 컴포넌트
│   └── Layout.tsx
├── navigator/                    # 네비게이션 UI
│   └── BottonNav.tsx
├── pages/                        # 주요 페이지 라우트
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Mypage.tsx
│   ├── Report.tsx
│   └── ... (기타 페이지)
├── types/                        # 커스텀 타입 선언
│   ├── swiper-css.d.ts
│   └── wordcloud.d.ts
├── utils/                        # 유틸리티 함수
│   ├── extractWordFrequency.ts
│   ├── getStartAndEndOfWeek.ts
│   └── ... (기타 유틸)
├── App.tsx                       # 진입점 App 컴포넌트
├── index.css                     # 전역 스타일
├── main.tsx                      # 엔트리 포인트
└── vite-env.d.ts                 # Vite 환경 타입 정의

```

---

## 🧠 Architecture

```
[User] → [React UI] → [Axios] → [Spring Boot API] → [Redis/MySQL/ChatGPT] ↔ [AI 기반 리포트 분석]
```

---

