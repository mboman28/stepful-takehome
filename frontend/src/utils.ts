export function timesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    if (start1 <= start2 && end1 > start2) {
        return true;
    }
    if (start2 <= start1 && end2 > start1) {
        return true;
    }
    return false;
}