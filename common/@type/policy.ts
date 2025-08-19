/**
 * 약관 인터페이스
 */
interface Policy {
    id: number;
    content: string;
    code: string;
    isRequired: boolean;
    label: string;
}

interface PrevPolicy {
    id: number,
    title: string
}

interface DisplayPolicy {
    id: number;
    title: string;
    contents: string;
    displayDate: string;
}

export { Policy, PrevPolicy, DisplayPolicy };
