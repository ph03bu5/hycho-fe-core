# @hec/core



현대 엔지니어링 대고객 자산 관리 프로젝트 프론트엔드 모바일 애플리케이션, 웹 애플리케이션 개발을 지원하기 위한 공통 모듈



## 제공하는 기능

#### 	React 컴포넌트

- **AnchorsWebInput** - 라디오버튼/체크박스, 콤보박스, 텍스트 등 사용자 입력을 받는 React Web 컴포넌트
  (react-bootstrap, react-hook-form 기반)
- **AnchorsWebDataTable** - 테이블 표출을 위한 컴포넌트, 컬럼 설정 및 행 체크 기능 등 지원

#### 	공통 클래스/헬퍼

- **useHookForm** - react-hook-form 확장, useForm의 기능을 사용하는 범위로 제한.
- **API** - 백엔드 연동에 사용. React / React Native 공통. get, post, put, delete, patch 메소드 지원.
- **getUuid** - UUID v4 생성 기능
- **EMAIL_REG_EXR** - 이메일 검증 정규식

## 사용 방법

1. #### 설치

```sh
$ yarn add @hec/core --registry=http://nexus.anchors-biz.com
```



2. #### 활용

​	필요한 모듈에서 import하여 JSX에 적용한다

```react
import { AnchorsWebInput, useHookForm } from '@hec/core';

export function HelloInput() {
	const { handleSubmit, reset, formHandle } = useHookForm();
	const onSubmit = (data) => console.log(data);
	
	return (
	  <div>
	    <AnchorsWebInput id="email" type="email" formHandle={formHandle} label="E-mail 주소"/>
      <AnchorsWebInput id="password" type="password"formHandle={formHandle} label="비밀번호"/>
      
      <button type="button" onClick={handleSubmit(onSubmit)}>로그인</button>
    </div>
  );  
}
```



3. #### 상세 API

   1. ##### useHookForm

      함수 실행 파라미터를 통해 폼의 기본값을 정의할 수 있으며 리턴은 다음과 같음.

      | 프로퍼티       | 타입                                                | 설명                                                         |
      | -------------- | --------------------------------------------------- | ------------------------------------------------------------ |
      | **formHandle** | {register: any, control: any, errors: any}          | AnchorsWebInput, AnchorsAppInput 등에 formHandle 속성으로 정의하는 폼 핸들. 본 디펜던시에서 고유하게 추가된 함수 |
      | handleSubmit   | (handler: (data:any) => void) => void               | 폼 유효값 설정을 수행하고, 성공시 파라미터로 지정한 함수를 실행 |
      | reset          | (values: any) => void                               | 파라미터에 설정된 값으로 폼 초기화                           |
      | formState      | {isDirty, isValid, errors, ...}                     | 현재 폼의 상태 값을 리턴<br />상세 스펙은 https://react-hook-form.com/api/useform/formstate 참고 |
      | getValues      | (payload?: string\|string[]) => Object              | 요청된 필드의 값을 리턴                                      |
      | setValue       | (name: string, value: any, config?: Object) => void | 요청된 필드의 값을 변경<br />상세 스펙은 https://react-hook-form.com/api/useform/setvalue 참고 |

      

   2. ##### AnchorsWebInput

      | property   | type                                       | description |
      | ---------- | ------------------------------------------ | ----------- |
      | id         | string                                     |             |
      | type       | string                                     |             |
      | [data]     | {label: string, value: any}[]              |             |
      | [rows]     |                                            |             |
      | formHandle | {register: any, control: any, errors: any} |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |
      |            |                                            |             |

      

   3. AnchorsWebDataTable

      1. 

   4. API