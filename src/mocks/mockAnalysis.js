// =====================================================================
// 가짜 분석 결과 (백엔드 없이 화면 개발용)
//
// 형식은 백엔드 AnalysisResponse 와 동일합니다. (README 의 "API" 참고)
// "경고 30개 → 실제 위험 3개" 데모 시나리오에 맞춰 만들었습니다.
//
// ⚠️ CVE 번호와 내용은 화면 확인용 예시입니다. 발표 자료에는 실제 Trivy 결과를 사용하세요.
// =====================================================================

// 실제로 실행된 취약점 3개 (REACHABLE)
const reachable = [
  {
    cveId: 'CVE-2022-1471',
    library: 'org.yaml:snakeyaml',
    installedVersion: '1.30',
    fixedVersion: '2.0',
    severity: 'HIGH',
    title: 'SnakeYAML Constructor 역직렬화로 인한 원격 코드 실행',
    referenceUrl: 'https://avd.aquasec.com/nvd/cve-2022-1471',
    reachability: 'REACHABLE',
    loadedClassCount: 42,
  },
  {
    cveId: 'CVE-2022-42003',
    library: 'com.fasterxml.jackson.core:jackson-databind',
    installedVersion: '2.13.3',
    fixedVersion: '2.13.4.2',
    severity: 'HIGH',
    title: '깊게 중첩된 배열로 인한 리소스 고갈',
    referenceUrl: 'https://avd.aquasec.com/nvd/cve-2022-42003',
    reachability: 'REACHABLE',
    loadedClassCount: 310,
  },
  {
    cveId: 'CVE-2023-24998',
    library: 'org.apache.tomcat.embed:tomcat-embed-core',
    installedVersion: '9.0.63',
    fixedVersion: '9.0.71',
    severity: 'MEDIUM',
    title: '파일 업로드 요청 개수 제한 부재로 인한 서비스 거부',
    referenceUrl: 'https://avd.aquasec.com/nvd/cve-2023-24998',
    reachability: 'REACHABLE',
    loadedClassCount: 1204,
  },
];

// 포함만 되고 실행되지 않은 취약점 27개 (NOT_LOADED) — 화면 확인용 자동 생성
const notLoadedLibraries = [
  ['org.springframework:spring-expression', 'CRITICAL'],
  ['org.springframework:spring-webmvc', 'HIGH'],
  ['ch.qos.logback:logback-core', 'MEDIUM'],
  ['org.apache.logging.log4j:log4j-api', 'LOW'],
  ['com.fasterxml.jackson.dataformat:jackson-dataformat-xml', 'HIGH'],
  ['org.hibernate.validator:hibernate-validator', 'MEDIUM'],
  ['io.netty:netty-codec-http', 'HIGH'],
  ['commons-io:commons-io', 'MEDIUM'],
  ['org.apache.commons:commons-text', 'CRITICAL'],
];

const notLoaded = Array.from({ length: 27 }, (_, i) => {
  const [library, severity] = notLoadedLibraries[i % notLoadedLibraries.length];
  return {
    cveId: `CVE-MOCK-${String(i + 1).padStart(4, '0')}`,
    library,
    installedVersion: '0.0.0',
    fixedVersion: '0.0.1',
    severity,
    title: '화면 확인용 예시 취약점',
    referenceUrl: '',
    reachability: 'NOT_LOADED',
    loadedClassCount: 0,
  };
});

export const mockAnalysis = {
  id: 1,
  createdAt: '2026-11-01T12:00:00',
  summary: { totalCount: 30, reachableCount: 3, notLoadedCount: 27 },
  findings: [...reachable, ...notLoaded],
};

// ---------------------------------------------------------------------
// 의존성 그래프용 가짜 데이터
// TODO(백엔드): 서버에 의존성 트리 API 가 생기면 이 데이터를 대체합니다.
//   예상 형식: { nodes: [{ id, label, vulnerable, reachable }], edges: [{ source, target }] }
// ---------------------------------------------------------------------
export const mockDependencyGraph = {
  nodes: [
    { id: 'app', label: 'sample-app', root: true },
    { id: 'starter-web', label: 'spring-boot-starter-web' },
    { id: 'starter', label: 'spring-boot-starter' },
    { id: 'starter-json', label: 'spring-boot-starter-json' },
    { id: 'starter-tomcat', label: 'spring-boot-starter-tomcat' },
    { id: 'snakeyaml', label: 'snakeyaml\n1.30', vulnerable: true, reachable: true },
    { id: 'jackson', label: 'jackson-databind\n2.13.3', vulnerable: true, reachable: true },
    { id: 'tomcat', label: 'tomcat-embed-core\n9.0.63', vulnerable: true, reachable: true },
    { id: 'logback', label: 'logback-core', vulnerable: true, reachable: false },
    { id: 'spring-expr', label: 'spring-expression', vulnerable: true, reachable: false },
  ],
  edges: [
    { source: 'app', target: 'starter-web' },
    { source: 'starter-web', target: 'starter' },
    { source: 'starter-web', target: 'starter-json' },
    { source: 'starter-web', target: 'starter-tomcat' },
    { source: 'starter', target: 'snakeyaml' },
    { source: 'starter', target: 'logback' },
    { source: 'starter-json', target: 'jackson' },
    { source: 'starter-tomcat', target: 'tomcat' },
    { source: 'starter-web', target: 'spring-expr' },
  ],
};
