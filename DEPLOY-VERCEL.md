# 개인 트래커: Vercel 배포 안내

## 준비된 상태

- React + TypeScript + Vite 정적 앱. 빌드 명령 `npm run build`, 결과 폴더 `dist`.
- 환경변수, 로그인, 데이터베이스, 서버 API는 필요 없습니다.
- 기존 화면, 기능, `personal-tracker:v1` 저장 키와 데이터 구조를 유지했습니다.
- `vercel.json`이 설치 명령 `npm ci`, 빌드 명령, 출력 폴더, PWA 파일 캐시 정책을 지정합니다.
- npm 잠금 파일을 추가하고 기존 사용 버전을 고정했습니다. pnpm 설정도 함께 유지했습니다.
- 공개 배포는 아직 하지 않았습니다. 아래 과정은 본인 GitHub/Vercel 계정으로 진행합니다.

## 1. GitHub에 올리기

GitHub 연결은 필수는 아닙니다(Vercel CLI로도 배포 가능). 다만 버튼으로 배포하고 이후 자동 업데이트하려면 GitHub 연결을 권장합니다.

1. 제공된 `personal-tracker-vercel.zip`을 압축 해제합니다. 이 배포용 압축에는 개발 의존성 폴더나 기존 PC용 실행 파일이 없습니다.
2. [GitHub](https://github.com)에 로그인합니다.
3. 우측 상단 **+ → New repository**를 클릭합니다.
4. Repository name에 `personal-tracker`를 입력합니다. **Private**으로 만들어도 배포할 수 있습니다. **Create repository**를 누릅니다.
5. 새 저장소 안내의 **uploading an existing file**을 클릭합니다. 기존 저장소 화면에서는 **Add file → Upload files**입니다.
6. 압축 해제한 폴더 **안의 파일과 폴더 전체**를 올립니다. `src`, `public` 폴더도 포함합니다. 저장소 첫 화면에 `package.json`과 `vercel.json`이 바로 보여야 합니다. ZIP 자체를 올리면 안 됩니다.
7. 아래 **Commit changes**를 누릅니다.

## 2. Vercel에서 Import → Deploy

1. [Vercel](https://vercel.com)에 로그인합니다. **Continue with GitHub**를 이용할 수 있습니다.
2. 대시보드의 **Add New… → Project**를 클릭합니다.
3. **Import Git Repository**에서 GitHub를 연결합니다. 권한 요청이 나오면 방금 만든 저장소를 허용합니다.
4. `personal-tracker` 옆 **Import**를 누릅니다.
5. **Project Name**을 원하는 이름으로 지정합니다. 이름이 이미 사용 중이면 다른 이름을 고릅니다.
6. 설정을 확인합니다:

   | 항목 | 값 |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `./` (package.json이 있는 위치) |
   | Install Command | `npm ci` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Environment Variables | 추가하지 않음 |

   설정은 `vercel.json`에 준비되어 있습니다. 폴더째 올렸다면 Root Directory의 **Edit**에서 해당 폴더를 선택합니다.
7. **Deploy**를 누릅니다. 완료 상태가 **Ready**인지 확인합니다.
8. **Continue to Dashboard / Visit**에서 앱을 엽니다. 프로젝트 **Settings → Domains**에서 기본 Production 주소(`…vercel.app`)를 확인하고 이 주소를 공유합니다. 매번 달라지는 Preview 주소 대신 고정 Production 주소를 사용하세요.
9. 시크릿 창에서 같은 주소를 열어 로그인 없이 접속되는지 확인합니다. Vercel 로그인 화면이 나오면 **Settings → Deployment Protection**에서 Production 도메인이 보호 대상으로 지정되어 있는지 확인하고 공개 접속을 허용합니다. 앱 자체에는 로그인 기능이 없습니다.

## 3. 배포 직후 확인

실제 공개 URL에서 아래 확인은 배포 완료 후에만 가능합니다. 로컬 프로덕션 빌드에서는 저장, 오프라인, 화면 크기별 동작을 확인했습니다.

1. Production URL에서 습관을 체크하고 할 일·메모를 입력합니다.
2. 새로고침 → 기록 유지 확인 → 창을 닫고 **같은 브라우저 프로필, 같은 URL**로 다시 접속합니다.
3. 다른 브라우저 또는 다른 사람의 기기에서 접속하여 자신의 데이터가 보이지 않는지 확인합니다.
4. 휴대폰과 PC에서도 열어 입력·체크가 되는지 확인합니다.
5. 설치 후 온라인에서 한 번 실행한 다음 오프라인에서도 다시 열리는지 확인합니다.

데이터는 사용자 계정이 아닌 **브라우저 프로필 + 사이트 주소**별로 저장됩니다. 같은 컴퓨터의 같은 프로필을 함께 쓰면 같은 데이터를 봅니다. 브라우저 저장 데이터 삭제나 시크릿 모드 종료 시 유지되지 않을 수 있습니다. 앱은 기록 내용을 서버로 전송하지 않습니다.

기존 `http://127.0.0.1:5173` 데이터는 배포 주소와 별개이며 자동 이전되지 않습니다. 기존 바탕화면 바로가기도 계속 로컬 앱을 엽니다. 온라인 버전을 사용하려면 아래 방법으로 배포 주소의 앱을 따로 설치하세요.

## 4. 바탕화면 앱으로 설치

먼저 **배포된 Production URL**을 Chrome 또는 Edge에서 엽니다.

- **Chrome:** 주소창 오른쪽 설치 아이콘 → **설치**. 또는 **⋮ → 전송, 저장, 공유 → 페이지를 앱으로 설치**(메뉴 이름은 버전에 따라 다를 수 있음). 바탕화면 바로가기가 없으면 `chrome://apps` → 개인 트래커 우클릭 → 바로가기 만들기 → 바탕화면을 선택합니다.
- **Edge:** 주소창 설치 아이콘 또는 **… → 기타 도구 → 앱 → 이 사이트를 앱으로 설치** → **설치**. 이후 표시되는 **바탕 화면 바로 가기 만들기**를 선택합니다. 나중에는 `edge://apps` → 개인 트래커의 **세부 정보 → 바로 가기 만들기**를 사용할 수 있습니다.
- 앱 화면에 **앱 설치** 버튼이 표시되면 그 버튼을 눌러도 됩니다.

PWA 설정은 이름/짧은 이름 `개인 트래커`, `standalone`, 기존 테마·배경색, 루트 경로 manifest, 192/512px PNG 아이콘, 오프라인 서비스 워커를 갖추고 있습니다. Vercel의 HTTPS 주소에서 사용할 수 있습니다. 실제 설치 완료/OS 바로가기 생성은 사용자 브라우저에서 진행합니다.

## 5. 이후 수정과 자동 재배포

- 연결한 GitHub 저장소의 Production branch(보통 `main`)에 코드를 올리면 Vercel이 자동 빌드·재배포합니다.
- 작은 수정: GitHub에서 파일 클릭 → 연필(Edit) → 수정 → **Commit changes**. 여러 파일 변경은 개발 도구에서 commit/push합니다.
- **이 PC의 파일만 수정하면 공개 사이트는 바뀌지 않습니다.** GitHub에 반영해야 합니다.
- 재배포 진행은 Vercel **Deployments**에서 확인합니다. Ready가 되면 기존 Production URL을 새로고침합니다.
- 주소와 localStorage 키를 그대로 유지하면 재배포해도 각 브라우저의 데이터가 남습니다. 오프라인 캐시 구성을 변경할 때는 `public/sw.js`의 CACHE 버전을 올립니다.

## 공식 안내

- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Git 연결과 자동 배포](https://vercel.com/docs/git)
- [배포 주소](https://vercel.com/docs/deployments/generated-urls)
- [배포 접근 보호 설정](https://vercel.com/docs/deployment-protection)
- [Chrome 웹앱 사용](https://support.google.com/chrome/answer/9658361)
- [Edge 앱 설치/바로가기](https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge)
