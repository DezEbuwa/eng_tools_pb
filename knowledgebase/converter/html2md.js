const cheerio = require('cheerio');

/**
 * Converts an HTML table into a markdown table.
 * @param {string} htmlTable - The HTML string containing the table tags.
 * @returns {string} - The markdown representation of the table.
 */
function convertHtmlTableToMarkdown(htmlTable) {
    const $ = cheerio.load(htmlTable);
    const rows = [];
    
    $('table tr').each((_, tr) => {
        const row = [];
        $(tr).find('th, td').each((_, cell) => {
            row.push($(cell).text().trim());
        });
        rows.push(row);
    });

    if (rows.length === 0) {
        return '';
    }

    // Create markdown header
    const headers = rows.shift(); // First row is considered the header
    const columnWidths = headers.map(header => header.length);

    // Calculate column widths based on all rows
    rows.forEach(row => {
        row.forEach((cell, index) => {
            columnWidths[index] = Math.max(columnWidths[index], cell.length);
        });
    });

    const padCell = (cell, width) => cell.padEnd(width, ' ');

    const markdownRows = [
        // Header row
        headers.map((header, index) => padCell(header, columnWidths[index])).join(' | '),
        // Separator row
        columnWidths.map(width => '-'.repeat(width)).join(' | ')
    ];

    // Data rows
    rows.forEach(row => {
        markdownRows.push(
            row.map((cell, index) => padCell(cell, columnWidths[index])).join(' | ')
        );
    });

    return markdownRows.join('\n');
}

// Example usage:
const htmlTable = `
<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
    </tr>
    <tr>
        <td>Alice</td>
        <td>30</td>
        <td>New York</td>
    </tr>
    <tr>
        <td>Bob</td>
        <td>25</td>
        <td>Los Angeles</td>
    </tr>
</table>
`;

console.log(convertHtmlTableToMarkdown(htmlTable));
