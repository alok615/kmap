import { useState, useEffect } from "react";

export default function KMap({ variables, values, updateCell, groupings }) {
    // Fixed dimensions for 4 variables: 4x4 grid
    const dimensions = { rows: 4, cols: 4 };

    const getGrayCode = (size) => {
        if (size <= 1) return ["0", "1"];
        const prevGrayCode = getGrayCode(size - 1);
        const result = [
            ...prevGrayCode.map((code) => "0" + code),
            ...prevGrayCode.reverse().map((code) => "1" + code),
        ];
        return result;
    };

    // Get row and column headers in Gray code order (for 4 variables)
    const rowHeaders = getGrayCode(2); // 2 bits for rows (A, B)
    const colHeaders = getGrayCode(2); // 2 bits for columns (C, D)

    // Convert row, col coordinates to index in values array
    const getIndex = (row, col) => {
        // Get binary from gray code
        const rowBinary = parseInt(rowHeaders[row], 2);
        const colBinary = parseInt(colHeaders[col], 2);

        // Combine the binary representations for 4 variables
        return (rowBinary << 2) | colBinary;
    };

    // Check if a cell is part of a grouping
    const getCellStyles = (row, col) => {
        const index = getIndex(row, col);

        // Check if this cell is part of any grouping
        const cellGroups = groupings.filter((group) => group.cells.includes(index));

        let borderStyle = "";
        if (cellGroups.length > 0) {
            const group = cellGroups[0]; // Use the first group if multiple
            borderStyle = `4px solid ${group.color}`;
        }

        return {
            border: borderStyle,
        };
    };

    // Fixed variable labels for 4 variables
    const rowVars = ["A", "B"]; // First two variables for rows
    const colVars = ["C", "D"]; // Last two variables for columns

    return (
        <div className="overflow-x-auto">
            <div className="min-w-full">
                {/* Column variable labels */}
                <div className="flex pl-12 mb-2">
                    <div className="font-bold text-center">{colVars.join(",")}</div>
                </div>

                {/* K-map grid */}
                <div className="grid">
                    {/* Header row with column headers */}
                    <div className="flex mb-1">
                        {/* Row variable labels in top-left corner */}
                        <div className="w-12 text-right pr-2 font-bold">{rowVars.join(",")}</div>

                        {/* Column headers */}
                        {colHeaders.map((header, colIdx) => (
                            <div key={`col-${colIdx}`} className="w-12 text-center">
                                {header}
                            </div>
                        ))}
                    </div>

                    {/* K-map cells with row headers */}
                    {rowHeaders.map((rowHeader, rowIdx) => (
                        <div key={`row-${rowIdx}`} className="flex mb-1">
                            {/* Row header */}
                            <div className="w-12 text-right pr-2 py-2 font-semibold">{rowHeader}</div>

                            {/* Cells */}
                            {colHeaders.map((colHeader, colIdx) => {
                                const index = getIndex(rowIdx, colIdx);
                                return (
                                    <div
                                        key={`cell-${rowIdx}-${colIdx}`}
                                        className="w-12 h-12 flex items-center justify-center border border-muted-foreground/20 cursor-pointer transition-all hover:bg-muted"
                                        style={getCellStyles(rowIdx, colIdx)}
                                        onClick={() => updateCell(index)}
                                    >
                                        <span className="text-lg font-semibold">
                                            {values[index] !== undefined ? values[index] : 0}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
