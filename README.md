
## 😎 기부하는 것에 무거운 마음먹지 않도록, 훨씬 가깝고 친숙한 기부 플랫폼 GIVOU
<br /> <br />
![깁유 메인](https://github.com/FU11-M00N/givou/assets/52348215/10f4fcd8-5104-477e-bb69-9626cea636d6)
![깁유 프로필](https://github.com/FU11-M00N/givou/assets/52348215/770864a9-5dc9-41b2-bbfb-41a77f82bcae)


<br />

- 유저와 기부를 받는 대상을 주목하던 기존 플랫폼과는 달리 유저간의 **상호작용**을 돕는 플랫폼
- 특정 보육원에 기부하면, 일정 금액 이상 모아진 기부금을 **투명**하게 전달하는 플랫폼
<br />

### 👋 무슨 기술을 사용했나요?

- Node.js
- MySQL (v8.0), ORM - Sequelize
- AWS EC2, Docker, Redis
- Naver Cloud SENS(**Simple & Easy Notification Service**)
- Kakao OAuth 2.0, Google OAuth2.0
- Https

<br />


## API Docs

![image](https://github.com/FU11-M00N/givou/assets/52348215/eaa990d3-2e50-4ef9-9323-c7c2d5a33f4f)


아래 링크는 Postman 을 통해 API 를 문서화한 것이며,
front 측 에서의 HTTP Method, path, parameter 등의 request 정보와
이에 걸맞는 / 서버가 의도한 response 정보가 동시에 담겨있습니다.
해당 API에 대한 간단한 설명도 포함되어 있어 개발하는 과정에서 편리하게 이용했습니다.

[🔗 Givou-API-Doc](https://documenter.getpostman.com/view/25249897/2s93z88PeH)

(페이지가 로딩되지 않는다면 새로고침 🔃 부탁드립니다.)

<br />

---

### 테이블 ERD

![givou_table_f](https://github.com/FU11-M00N/givou/assets/52348215/8f187d12-bd08-4d0e-817d-6fcbed5ad396)
<br />
## 학습한 내용 & 고민 했던 내용

### DB 에서 처리 vs 메모리에서 처리

“포스트의 날짜를 특정 조건에 따라 형식을 변경해서 달라”는 프론트 개발자의 요청으로부터 시작되었습니다.
이 요구사항 같은 경우 DB 내장함수인 NOW 와 문자열 조작함수인 substring 을 이용해 
데이터베이스 내에서 충분히 처리할 수 있었고, 
데이터베이스 엔진은 대량의 데이터를 효율적으로 처리하는데 최적화 되어있으므로 
성능상의 이점의 근거가 확실하다고 판단하여 javascript 에서 for-loop을 돌며 직접 데이터를 조작했던 로직을 변경하였습니다.

### 휴대전화 인증 - Redis

- 사용자가 인증한 이후에는 garbage 값이 되어 삭제해야한다
- 1분이 지나 삭제한다고 가정했을 때, 유저마다 1분이 카운팅되어야한다

와 같은 이유로 Redis 서버를 구축하여 휴대전화 인증을 구현했습니다.

<br />

## 개선할 내용

### 조회수 update flow

- 현재 상황
    - 지금 로직은 조회수 기능은 유저가 해당 글을 보면 그 즉시 Post table 을 Update 하게 되어있습니다.
- 개선하고자 하는 방향
    - 구축해둔 **Redis 서버를 이용해 캐싱**하고, 특정 시간이 지난 후 한번에 DB로 Write 하는 방향으로 쿼리 비용을 줄여보고 싶습니다.

<br />
