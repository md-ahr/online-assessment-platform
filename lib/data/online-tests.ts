export type OnlineTest = Readonly<{
  id: string;
  title: string;
  candidates: number | null;
  questionSet: number | null;
  examSlots: number | null;
}>;

const BASE_TITLE = "Psychometric Test for Management Trainee Officer";

function makeTest(index: number): OnlineTest {
  const unset = index % 4 === 2;
  const title =
    index % 11 === 10 ? "Role Aptitude Test — Senior Analyst" : BASE_TITLE;
  return {
    id: `online-test-${index + 1}`,
    title,
    candidates: unset ? null : 10_000,
    questionSet: unset ? null : 3,
    examSlots: unset ? null : 3,
  };
}

export const ONLINE_TESTS: readonly OnlineTest[] = Array.from(
  { length: 50 },
  (_, i) => makeTest(i)
);
