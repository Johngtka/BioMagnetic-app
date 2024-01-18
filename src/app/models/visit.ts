export interface Visit {
    patientId: string;
    note: string;
    points: Array<Point>;
}
interface Point {
    id: string;
    comment: string;
}
