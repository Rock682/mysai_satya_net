
/**
 * A robust CSV to JSON converter that handles newlines and commas within quoted fields.
 * This function is moved from the backend to the frontend.
 * @param csv The CSV string to parse.
 * @returns An array of objects.
 */
export const csvToJson = (csv: string): Record<string, string>[] => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentField = '';
    let inQuotes = false;

    csv = csv.replace(/\r\n/g, '\n').trim();

    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentLine.push(currentField);
                currentField = '';
            } else if (char === '\n') {
                currentLine.push(currentField);
                lines.push(currentLine);
                currentLine = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    currentLine.push(currentField);
    lines.push(currentLine);

    const nonEmptyLines = lines.filter(line => line.length > 1 || (line.length === 1 && line[0].trim() !== ''));
    if (nonEmptyLines.length < 2) return [];

    const headers = nonEmptyLines.shift()!.map(h => h.trim().toLowerCase());
    
    return nonEmptyLines.map(line => {
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
            obj[header] = line[i] ? line[i].trim() : '';
        });
        return obj;
    });
};
