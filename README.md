# Flow Test
플로우 과제 - 파일 확장자 차단

## 사용 기술
[![](https://img.shields.io/badge/NestJS-gray?logo=nestjs)](https://nestjs.com/)
[![](https://img.shields.io/badge/javascript-gray?logo=javascript)](https://www.ecma-international.org/)
[![](https://img.shields.io/badge/typescript-gray?logo=typescript)](https://www.typescriptlang.org/)
[![](https://img.shields.io/badge/HTML-gray?logo=HTML5)](https://www.w3.org/)
[![](https://img.shields.io/badge/CSS-gray?logo=CSS)](https://www.w3.org/TR/CSS/#css)
[![](https://img.shields.io/badge/docker-gray?logo=docker)](https://www.docker.com/)

## DB
### table
![image](https://github.com/hunkicho/flow_test/assets/115965829/add03017-9a86-452c-8e4e-7c03e3f593b6)

### primary key
- extension_id (auto_increment)

### index
- extension_id (primary)
- name (unique)
- type, name (composite Index)

## 고려한 점
### 커스텀 확장자 중복 체크
커스텀 확장자 추가 시 DB를 조회하여 이미 존재할 시 추가할 수 없도록 하였습니다.

### 커스텀 확장자 형식 검사
정규식을 사용하여 커스텀 확장자의 형식을 지정하였습니다. 해당 문제에서는 최대 20자리라는 제한사항만 존재하지만 보통 확장자에는 영어가 들어가지 않기 때문에 제가 임의의 형식을 지정하였습니다.
1. 첫 글자는 영어로 시작해야 합니다.
2. 필요한 경우 숫자를 포함할 수 있으며 연속적으로 여러 개 나올 수 있습니다.
3. 문자열의 길이는 최소 1자, 최대 20자여야 합니다.
4. 공백은 허용되지 않습니다.
5. .(마침표)는 첫 번째 또는 마지막 위치를 제외한 모든 위치에서 허용되며, 연속적으로 나오지 않습니다.(ex: tar.gz)
6. .(마침표) 은 한번만 나올 수 있다.
7. 영어, 숫자, .(마침표)를 제외한 값은 들어갈 수 없다.

해당 로직은 프론트에서 한번, 백앤드에서 한번 검사합니다. 개발자 도구를 통한 스크립트 변경이 있을 수도 있고 postman같은 도구로 서버에 직접 접근할 수도 있기에 프론트/백 두 곳에서 검사합니다.

### 서버에서 요청 처리 전 프론트 입력 막기
제가 만든 페이지는 자바스크립트의 fetch를 이용하여 서버에 비동기적으로 요청합니다. 페이지 전환없이 구현하기 위함입니다. 그 과정 중 혹시나 서버에서 요청을 처리하기 전 까지 잠시 시간이 걸릴 경우, 프론트에서 다시 요청을 할 수 있다고 생각했습니다(추가 버튼 클릭 / 체크박스 클릭 / 제거 버튼 클릭 등). 따라서 프론트에서 서버에 요청 시 스크립트를 통해 추가 버튼, 체크박스, 텍스트박스, 제거 버튼을 비활성화 하도록 하였습니다.

### RESTful한 api 만들기
RESTful한 조건을 만족하기 위해 노력하였습니다. 추가/조회/제거에 맞는 HTTP메소드를 사용하였고 상황에 맞는 응답코드를 반환하도록 하였습니다. 과제 화면에서는 수정기능이 보이지 않았기에 추가, 조회, 제거 3가지만 만들었습니다.

### 예외처리
형식에 맞지 않는 확장자 명, 이미 존재하는 확장자 명 등의 예외를 처리하였습니다. http status code와 메시지를 통해 클라이언트가 오류 내용을 알 수 있도록 하였습니다.

### 테스트코드 작성
service layer의 테스트 코드를 작성하여 로직을 점검하였습니다. 

### 기술스택 선정
과제 페이지가 간단하였기 때문에 프론트는 HTML/CSS와 javascript를 사용하기로 하였습니다. 따라서 백엔드 또한 javascript를 사용하는 node를 고려했고 최종적으로 구현시간을 단축하기 위해 제가 이전에 사용했던 spring과 비슷한 nestjs를 사용하기로 하였습니다. 

### 태그정렬
inline-flex속성을 활용하여 태그들이 화면에 맞게 정렬되도록 하였습니다.

### 인덱스 설계
페이지 로드 때마다 매번 where문을 통해 태그 리스트들을 조회하기 때문에 인덱스가 필요하다고 생각했습니다. 다만 페이지 특성상 insert와 delete가 빈번하지 않을까 고민하였으나 한번 설정한 것을 다시 바꾸는 일은 많지 않을거 같아 조회 시 자주 사용되는 type과 name을 인덱스로 만들었습니다.
