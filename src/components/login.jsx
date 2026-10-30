import { useState } from 'react';

/**
 * 로그인 화면.
 *
 * 화면 구성
 *   왼쪽  : 서비스 이름, 제목, 이메일/비밀번호 입력, 로그인 버튼, 회원가입 링크
 *   오른쪽: 비주얼 영역 (디자인 시안 기준 어두운 패널, 이미지가 정해지면 교체)
 *
 * @param {(email: string, password: string) => void} onLogin  로그인 실행 함수
 * @param {() => void} [onSignup]          [회원가입] 클릭 시
 * @param {() => void} [onForgotPassword]  [비밀번호를 잊어버렸나요?] 클릭 시
 * @param {boolean} [loading]  로그인 중이면 true (버튼 비활성화)
 */
export default function Login({ onLogin, onSignup, onForgotPassword, loading = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 입력 검증: 둘 중 하나라도 비어 있으면 에러 표시 후 중단
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 모두 입력하세요.');
      return;
    }
    setError('');
    onLogin(email.trim(), password);
  };

  return (
    <div className="login-page">
      <div className="login">
        <section className="login__form-side">
          <div className="login__brand">
            <span className="login__brand-dot" />
            DevSCA
          </div>

          <h1 className="login__title">로그인</h1>
          <p className="login__desc">
            로그인하여 기기 상태와 보안 이벤트를 확인하고 보호 정책을 관리하세요.
          </p>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <label className="login__input">
              <UserIcon />
              <input
                type="email"
                placeholder="이메일 주소"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </label>

            <label className="login__input">
              <LockIcon />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
              <button
                type="button"
                className="login__eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </label>

            <button type="button" className="login__link login__forgot" onClick={onForgotPassword}>
              비밀번호를 잊어버렸나요?
            </button>

            {error && <p className="form-error login__error">{error}</p>}

            <button className="login__submit" type="submit" disabled={loading}>
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <p className="login__signup">
            계정이 없으신가요?
            <button type="button" className="login__link" onClick={onSignup}>
              회원가입
            </button>
          </p>
        </section>

        {/* TODO: 디자인에서 이미지/일러스트가 정해지면 이 영역에 넣기 */}
        <aside className="login__visual" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ---------- 아이콘 (선 아이콘, currentColor 사용) ---------- */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function UserIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.8 3.7M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
